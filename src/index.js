import { USERS, computeStatus, CHALLENGE_DAYS, BLOCK_MIN_SEC, MIN_PAGES } from './rules.js';
import { makeSession, readSession, cookie, timingSafeEqual } from './auth.js';
import {
  providerConfig, getConn, listActivities, hevyConnect, stravaStart, stravaCallback,
  garminStart, garminCallback, garminWebhook, garminDisconnect,
} from './providers.js';

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

const now = () => new Date().toISOString();
const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const isLocalTime = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s);

function need(cond, msg, status = 400) {
  if (!cond) throw new HttpError(status, msg);
}

function viewUser(url) {
  const u = url.searchParams.get('user');
  need(USERS[u], 'Unknown user');
  return u;
}

async function ownRow(env, table, id, user) {
  const row = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
  need(row, 'Not found', 404);
  need(row.user_id === user, "You can only change your own entries", 403);
  return row;
}

// ---------- Day ----------

async function loadDay(env, user, date) {
  const [day, workouts, water, food, photos, settings] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM days WHERE user_id = ? AND date = ?').bind(user, date),
    env.DB.prepare('SELECT * FROM workouts WHERE user_id = ? AND date = ? ORDER BY start_local').bind(user, date),
    env.DB.prepare('SELECT * FROM water_entries WHERE user_id = ? AND date = ? ORDER BY created_at').bind(user, date),
    env.DB.prepare('SELECT * FROM food_entries WHERE user_id = ? AND date = ? ORDER BY created_at').bind(user, date),
    env.DB.prepare('SELECT id, kind, caption, created_at FROM photos WHERE user_id = ? AND date = ? ORDER BY created_at').bind(user, date),
    env.DB.prepare('SELECT * FROM settings WHERE user_id = ?').bind(user),
  ]);
  const d = day.results[0] || null;
  const waterMl = water.results.reduce((s, w) => s + w.amount_ml, 0);
  const progress = photos.results.filter((p) => p.kind === 'progress');
  // Default the book to the most recent one this person logged
  let lastBook = null;
  if (!d?.book_title) {
    const r = await env.DB.prepare(
      "SELECT book_title FROM days WHERE user_id = ? AND date < ? AND book_title IS NOT NULL AND book_title != '' ORDER BY date DESC LIMIT 1",
    ).bind(user, date).first();
    lastBook = r?.book_title || null;
  }
  return {
    user,
    date,
    day: d,
    workouts: workouts.results,
    water: water.results,
    food: food.results,
    meal_photos: photos.results.filter((p) => p.kind === 'meal'),
    progress_photos: progress,
    settings: settings.results[0] || null,
    last_book: lastBook,
    status: computeStatus(user, date, d, workouts.results, waterMl, progress.length),
  };
}

const DAY_FIELDS = {
  diet_held: 'bool', sugar_eaten: 'bool', book_title: 'text', pages_read: 'int',
  block1_outdoor: 'bool01', block2_outdoor: 'bool01', notes: 'text',
};

async function updateDay(env, user, body) {
  need(isDate(body.date), 'Bad date');
  const cols = [];
  const vals = [];
  for (const [k, type] of Object.entries(DAY_FIELDS)) {
    if (!(k in body)) continue;
    let v = body[k];
    if (type === 'bool') v = v === null ? null : v ? 1 : 0;
    if (type === 'bool01') v = v ? 1 : 0;
    if (type === 'int') v = v === null || v === '' ? null : Math.max(0, Math.round(Number(v)) || 0);
    if (type === 'text') v = v == null ? null : String(v).slice(0, k === 'notes' ? 5000 : 500);
    cols.push(k);
    vals.push(v);
  }
  need(cols.length, 'Nothing to update');
  await env.DB.prepare(
    `INSERT INTO days (user_id, date, ${cols.join(', ')}, updated_at) VALUES (?, ?, ${cols.map(() => '?').join(', ')}, ?)
     ON CONFLICT (user_id, date) DO UPDATE SET ${cols.map((c) => `${c} = excluded.${c}`).join(', ')}, updated_at = excluded.updated_at`,
  ).bind(user, body.date, ...vals, now()).run();
}

// ---------- Summary for the history grid ----------

async function summary(env, from, to) {
  const [days, workouts, water, photos, settings] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM days WHERE date BETWEEN ? AND ?').bind(from, to),
    env.DB.prepare('SELECT user_id, date, block, start_local, duration_sec FROM workouts WHERE date BETWEEN ? AND ?').bind(from, to),
    env.DB.prepare('SELECT user_id, date, SUM(amount_ml) AS ml FROM water_entries WHERE date BETWEEN ? AND ? GROUP BY user_id, date').bind(from, to),
    env.DB.prepare("SELECT user_id, date, COUNT(*) AS n FROM photos WHERE kind = 'progress' AND date BETWEEN ? AND ? GROUP BY user_id, date").bind(from, to),
    env.DB.prepare('SELECT * FROM settings'),
  ]);
  const key = (r) => `${r.user_id}|${r.date}`;
  const dayMap = new Map(days.results.map((r) => [key(r), r]));
  const waterMap = new Map(water.results.map((r) => [key(r), r.ml]));
  const photoMap = new Map(photos.results.map((r) => [key(r), r.n]));
  const woMap = new Map();
  for (const w of workouts.results) {
    if (!woMap.has(key(w))) woMap.set(key(w), []);
    woMap.get(key(w)).push(w);
  }
  const allKeys = new Set([...dayMap.keys(), ...waterMap.keys(), ...photoMap.keys(), ...woMap.keys()]);
  const out = { dylan: {}, neil: {} };
  for (const k of allKeys) {
    const [user, date] = k.split('|');
    if (!out[user]) continue;
    const s = computeStatus(user, date, dayMap.get(k), woMap.get(k) || [], waterMap.get(k) || 0, photoMap.get(k) || 0);
    out[user][date] = { parts: s.parts, done_count: s.done_count, complete: s.complete };
  }
  const settingsMap = Object.fromEntries(settings.results.map((s) => [s.user_id, s]));
  return { days: out, settings: settingsMap };
}

// ---------- Photos ----------
// Stored in R2 when the PHOTOS bucket is bound, otherwise in Workers KV (PHOTO_KV).

async function storePut(env, key, data, contentType) {
  if (env.PHOTOS) return env.PHOTOS.put(key, data, { httpMetadata: { contentType } });
  await env.PHOTO_KV.put(key, await new Response(data).arrayBuffer(), { metadata: { contentType } });
}

async function storeDelete(env, key) {
  if (env.PHOTOS) await env.PHOTOS.delete(key);
  if (env.PHOTO_KV) await env.PHOTO_KV.delete(key);
}

async function uploadPhoto(env, user, request) {
  const form = await request.formData();
  const file = form.get('file');
  const date = form.get('date');
  const kind = form.get('kind');
  need(file && typeof file !== 'string', 'No file');
  need(isDate(date), 'Bad date');
  need(kind === 'progress' || kind === 'meal', 'Bad kind');
  need(file.size < 20 * 1024 * 1024, 'Photo too large (20 MB max)');
  const type = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';
  const key = `${user}/${date}/${kind}/${crypto.randomUUID()}`;
  await storePut(env, key, file.stream(), type);
  const caption = (form.get('caption') || '').toString().slice(0, 200) || null;
  const row = await env.DB.prepare(
    'INSERT INTO photos (user_id, date, kind, r2_key, caption, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, kind, caption, created_at',
  ).bind(user, date, kind, key, caption, now()).first();
  return row;
}

async function servePhoto(env, id, request) {
  const row = await env.DB.prepare('SELECT r2_key FROM photos WHERE id = ?').bind(id).first();
  need(row, 'Not found', 404);
  const headers = new Headers({ 'Cache-Control': 'private, max-age=31536000, immutable', ETag: `"p${id}"` });
  if (request.headers.get('If-None-Match') === `"p${id}"`) return new Response(null, { status: 304, headers });
  const obj = env.PHOTOS && (await env.PHOTOS.get(row.r2_key));
  if (obj) {
    obj.writeHttpMetadata(headers);
    return new Response(obj.body, { headers });
  }
  need(env.PHOTO_KV, 'Not found', 404);
  const { value, metadata } = await env.PHOTO_KV.getWithMetadata(row.r2_key, 'stream');
  need(value, 'Not found', 404);
  headers.set('Content-Type', metadata?.contentType || 'image/jpeg');
  return new Response(value, { headers });
}

// ---------- Router ----------

async function handleApi(request, env, ctx, url) {
  const path = url.pathname.replace(/^\/api/, '');
  const method = request.method;
  const body = () => request.json().catch(() => ({}));

  // --- Public routes ---
  if (path === '/login' && method === 'POST') {
    const { user, password } = await body();
    const expected = USERS[user] && env[`${user.toUpperCase()}_PASSWORD`];
    need(expected && typeof password === 'string' && timingSafeEqual(password, expected), 'Wrong password', 401);
    return json({ ok: true }, 200, { 'Set-Cookie': cookie('h75', await makeSession(env, user), 60 * 60 * 24 * 365) });
  }
  if (path === '/logout' && method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': cookie('h75', '', 0) });
  }
  if (path === '/oauth/strava/callback') return stravaCallback(env, url);
  if (path === '/oauth/garmin/callback') return garminCallback(env, url, request);
  if (path === '/garmin/push' && method === 'POST') {
    const payload = await body();
    ctx.waitUntil(garminWebhook(env, payload).catch((e) => console.error('garmin webhook', e)));
    return new Response('ok');
  }

  // --- Everything below requires login ---
  const me = await readSession(env, request);
  need(me && USERS[me], 'Not logged in', 401);

  if (path === '/me' && method === 'GET') {
    return json({
      me,
      users: Object.values(USERS),
      rules: { block_min_sec: BLOCK_MIN_SEC, min_pages: MIN_PAGES, days: CHALLENGE_DAYS },
      providers: providerConfig(env),
    });
  }

  if (path === '/day' && method === 'GET') {
    const date = url.searchParams.get('date');
    need(isDate(date), 'Bad date');
    return json(await loadDay(env, viewUser(url), date));
  }
  if (path === '/day' && method === 'PUT') {
    const b = await body();
    await updateDay(env, me, b);
    return json(await loadDay(env, me, b.date));
  }

  if (path === '/summary' && method === 'GET') {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    need(isDate(from) && isDate(to), 'Bad range');
    return json(await summary(env, from, to));
  }

  if (path === '/settings' && method === 'PUT') {
    const b = await body();
    if (b.start_date != null) need(isDate(b.start_date) || b.start_date === '', 'Bad date');
    await env.DB.prepare(
      `INSERT INTO settings (user_id, start_date, calorie_goal, timezone) VALUES (?, ?, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET
         start_date = COALESCE(excluded.start_date, settings.start_date),
         calorie_goal = COALESCE(excluded.calorie_goal, settings.calorie_goal),
         timezone = COALESCE(excluded.timezone, settings.timezone)`,
    ).bind(me, b.start_date ?? null, b.calorie_goal ? Math.round(Number(b.calorie_goal)) : null, b.timezone ?? null).run();
    return json(await env.DB.prepare('SELECT * FROM settings WHERE user_id = ?').bind(me).first());
  }

  // --- Workouts ---
  if (path === '/workouts' && method === 'POST') {
    const b = await body();
    need(isDate(b.date), 'Bad date');
    need(b.block === 1 || b.block === 2, 'Pick block 1 or 2');
    let w;
    if (b.source && b.source !== 'manual') {
      const a = await env.DB.prepare('SELECT * FROM external_activities WHERE provider = ? AND external_id = ? AND user_id = ?')
        .bind(b.source, String(b.external_id), me).first();
      need(a, 'Activity not found — refresh the import list');
      const dup = await env.DB.prepare('SELECT id FROM workouts WHERE user_id = ? AND source = ? AND external_id = ?')
        .bind(me, a.provider, a.external_id).first();
      need(!dup, 'That activity is already added');
      w = { source: a.provider, external_id: a.external_id, name: a.name, activity_type: a.activity_type, start_local: a.start_local, duration_sec: a.duration_sec, distance_m: a.distance_m };
    } else {
      need(isLocalTime(b.start_local), 'Enter a start time');
      const mins = Number(b.duration_min);
      need(mins > 0 && mins <= 600, 'Enter a duration in minutes');
      w = { source: 'manual', external_id: null, name: String(b.name || 'Workout').slice(0, 100), activity_type: b.activity_type || null, start_local: b.start_local, duration_sec: Math.round(mins * 60), distance_m: null };
    }
    await env.DB.prepare(
      `INSERT INTO workouts (user_id, date, block, source, external_id, name, activity_type, start_local, duration_sec, distance_m, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(me, b.date, b.block, w.source, w.external_id, w.name, w.activity_type, w.start_local, w.duration_sec, w.distance_m, now()).run();
    if (b.outdoor) await updateDay(env, me, { date: b.date, [`block${b.block}_outdoor`]: true });
    return json(await loadDay(env, me, b.date));
  }
  let m;
  if ((m = path.match(/^\/workouts\/(\d+)$/)) && method === 'DELETE') {
    const row = await ownRow(env, 'workouts', m[1], me);
    await env.DB.prepare('DELETE FROM workouts WHERE id = ?').bind(row.id).run();
    return json(await loadDay(env, me, row.date));
  }
  if ((m = path.match(/^\/workouts\/(\d+)$/)) && method === 'PATCH') {
    const row = await ownRow(env, 'workouts', m[1], me);
    const b = await body();
    need(b.block === 1 || b.block === 2, 'Pick block 1 or 2');
    await env.DB.prepare('UPDATE workouts SET block = ? WHERE id = ?').bind(b.block, row.id).run();
    return json(await loadDay(env, me, row.date));
  }
  if (path === '/activities' && method === 'GET') {
    const date = url.searchParams.get('date');
    need(isDate(date), 'Bad date');
    return json(await listActivities(env, me, date, url.searchParams.get('tz') || 'UTC'));
  }

  // --- Connections ---
  if (path === '/connections' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT user_id, provider, connected_at FROM connections').all();
    return json({ connections: results, providers: providerConfig(env) });
  }
  if (path === '/connect/strava' && method === 'GET') {
    need(providerConfig(env).strava, 'Strava is not configured on the server');
    return stravaStart(env, me, url.origin);
  }
  if (path === '/connect/garmin' && method === 'GET') {
    need(providerConfig(env).garmin, 'Garmin is not configured on the server');
    return garminStart(env, me, url.origin);
  }
  if (path === '/connect/hevy' && method === 'POST') {
    const { api_key } = await body();
    need(api_key && typeof api_key === 'string', 'Paste your Hevy API key');
    try {
      await hevyConnect(env, me, api_key.trim());
    } catch (e) {
      throw new HttpError(400, e.message);
    }
    return json({ ok: true });
  }
  if ((m = path.match(/^\/connections\/(strava|garmin|hevy)$/)) && method === 'DELETE') {
    const conn = await getConn(env, me, m[1]);
    if (conn && m[1] === 'garmin') await garminDisconnect(env, conn);
    await env.DB.prepare('DELETE FROM connections WHERE user_id = ? AND provider = ?').bind(me, m[1]).run();
    return json({ ok: true });
  }

  // --- Water ---
  if (path === '/water' && method === 'POST') {
    const b = await body();
    need(isDate(b.date), 'Bad date');
    const ml = Number(b.amount_ml);
    need(Number.isFinite(ml) && ml !== 0 && Math.abs(ml) <= 10000, 'Bad amount');
    await env.DB.prepare('INSERT INTO water_entries (user_id, date, amount_ml, label, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(me, b.date, ml, String(b.label || '').slice(0, 60) || null, now()).run();
    return json(await loadDay(env, me, b.date));
  }
  if ((m = path.match(/^\/water\/(\d+)$/)) && method === 'DELETE') {
    const row = await ownRow(env, 'water_entries', m[1], me);
    await env.DB.prepare('DELETE FROM water_entries WHERE id = ?').bind(row.id).run();
    return json(await loadDay(env, me, row.date));
  }
  if (path === '/water-units' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM water_units WHERE user_id = ? ORDER BY id').bind(me).all();
    return json(results);
  }
  if (path === '/water-units' && method === 'POST') {
    const b = await body();
    const ml = Number(b.ml);
    need(b.name && ml > 0 && ml <= 10000, 'Give the unit a name and size');
    await env.DB.prepare('INSERT INTO water_units (user_id, name, ml) VALUES (?, ?, ?)').bind(me, String(b.name).slice(0, 40), ml).run();
    const { results } = await env.DB.prepare('SELECT * FROM water_units WHERE user_id = ? ORDER BY id').bind(me).all();
    return json(results);
  }
  if ((m = path.match(/^\/water-units\/(\d+)$/)) && method === 'DELETE') {
    const row = await ownRow(env, 'water_units', m[1], me);
    await env.DB.prepare('DELETE FROM water_units WHERE id = ?').bind(row.id).run();
    const { results } = await env.DB.prepare('SELECT * FROM water_units WHERE user_id = ? ORDER BY id').bind(me).all();
    return json(results);
  }

  // --- Food / calories ---
  if (path === '/food' && method === 'POST') {
    const b = await body();
    need(isDate(b.date), 'Bad date');
    const cal = Math.round(Number(b.calories));
    need(Number.isFinite(cal) && cal > 0 && cal < 20000, 'Enter calories');
    await env.DB.prepare('INSERT INTO food_entries (user_id, date, name, calories, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(me, b.date, String(b.name || '').slice(0, 100) || null, cal, now()).run();
    return json(await loadDay(env, me, b.date));
  }
  if ((m = path.match(/^\/food\/(\d+)$/)) && method === 'DELETE') {
    const row = await ownRow(env, 'food_entries', m[1], me);
    await env.DB.prepare('DELETE FROM food_entries WHERE id = ?').bind(row.id).run();
    return json(await loadDay(env, me, row.date));
  }

  // --- Photos ---
  if (path === '/photos' && method === 'POST') {
    const photo = await uploadPhoto(env, me, request);
    return json(photo);
  }
  if (path === '/photos' && method === 'GET') {
    const kind = url.searchParams.get('kind') || 'progress';
    const { results } = await env.DB.prepare('SELECT id, date, kind, caption, created_at FROM photos WHERE user_id = ? AND kind = ? ORDER BY date, created_at')
      .bind(viewUser(url), kind).all();
    return json(results);
  }
  if ((m = path.match(/^\/photos\/(\d+)$/)) && method === 'GET') return servePhoto(env, m[1], request);
  if ((m = path.match(/^\/photos\/(\d+)$/)) && method === 'DELETE') {
    const row = await ownRow(env, 'photos', m[1], me);
    await storeDelete(env, row.r2_key);
    await env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(row.id).run();
    return json({ ok: true });
  }

  throw new HttpError(404, 'Not found');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      return await handleApi(request, env, ctx, url);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: 'Something went wrong' }, 500);
    }
  },
};
