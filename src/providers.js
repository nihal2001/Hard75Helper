// Strava, Garmin and Hevy integrations.
// Each provider normalises activities into:
//   { provider, external_id, name, activity_type, start_local, duration_sec, distance_m, outdoor_hint }

import { sign, verify, randomToken, sha256b64url, getCookie, cookie } from './auth.js';

const now = () => new Date().toISOString();

// Epoch ms -> "YYYY-MM-DDTHH:MM" in the given IANA time zone
export function toLocal(ms, tz) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: tz || 'UTC',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date(ms)).map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function providerConfig(env) {
  return {
    strava: !!(env.STRAVA_CLIENT_ID && env.STRAVA_CLIENT_SECRET),
    garmin: !!(env.GARMIN_CLIENT_ID && env.GARMIN_CLIENT_SECRET),
    hevy: true, // per-user API key, nothing to configure server-side
  };
}

async function getConn(env, user, provider) {
  return env.DB.prepare('SELECT * FROM connections WHERE user_id = ? AND provider = ?').bind(user, provider).first();
}

async function saveConn(env, user, provider, fields) {
  await env.DB.prepare(
    `INSERT INTO connections (user_id, provider, access_token, refresh_token, expires_at, api_key, external_user_id, connected_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id, provider) DO UPDATE SET
       access_token = excluded.access_token, refresh_token = excluded.refresh_token,
       expires_at = excluded.expires_at, api_key = excluded.api_key,
       external_user_id = COALESCE(excluded.external_user_id, connections.external_user_id)`,
  ).bind(
    user, provider, fields.access_token ?? null, fields.refresh_token ?? null, fields.expires_at ?? null,
    fields.api_key ?? null, fields.external_user_id ?? null, now(),
  ).run();
}

export async function cacheActivities(env, user, list) {
  if (!list.length) return;
  const stmt = env.DB.prepare(
    `INSERT INTO external_activities (provider, external_id, user_id, name, activity_type, start_local, duration_sec, distance_m, outdoor_hint, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (provider, external_id) DO UPDATE SET
       name = excluded.name, activity_type = excluded.activity_type, start_local = excluded.start_local,
       duration_sec = excluded.duration_sec, distance_m = excluded.distance_m, outdoor_hint = excluded.outdoor_hint,
       fetched_at = excluded.fetched_at`,
  );
  await env.DB.batch(list.map((a) => stmt.bind(
    a.provider, a.external_id, user, a.name, a.activity_type, a.start_local, a.duration_sec,
    a.distance_m ?? null, a.outdoor_hint ?? null, now(),
  )));
}

// ---------- OAuth state (signed, carries the user) ----------

async function makeState(env, user) {
  return sign(env.SESSION_SECRET, `${user}|${Math.floor(Date.now() / 1000) + 600}|${randomToken(8)}`);
}

async function readState(env, state) {
  const payload = await verify(env.SESSION_SECRET, state);
  if (!payload) return null;
  const [user, exp] = payload.split('|');
  return Number(exp) > Date.now() / 1000 ? user : null;
}

// ---------- Strava ----------

export async function stravaStart(env, user, origin) {
  const url = new URL('https://www.strava.com/oauth/authorize');
  url.search = new URLSearchParams({
    client_id: env.STRAVA_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${origin}/api/oauth/strava/callback`,
    approval_prompt: 'auto',
    scope: 'activity:read_all',
    state: await makeState(env, user),
  });
  return Response.redirect(url.toString(), 302);
}

export async function stravaCallback(env, url) {
  const user = await readState(env, url.searchParams.get('state'));
  const code = url.searchParams.get('code');
  if (!user || !code) return Response.redirect(`${url.origin}/#/settings?error=strava`, 302);
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID, client_secret: env.STRAVA_CLIENT_SECRET, code, grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) return Response.redirect(`${url.origin}/#/settings?error=strava`, 302);
  const t = await res.json();
  await saveConn(env, user, 'strava', {
    access_token: t.access_token, refresh_token: t.refresh_token, expires_at: t.expires_at,
    external_user_id: t.athlete?.id ? String(t.athlete.id) : null,
  });
  return Response.redirect(`${url.origin}/#/settings?connected=strava`, 302);
}

async function stravaToken(env, user, conn) {
  if (conn.expires_at && conn.expires_at > Date.now() / 1000 + 120) return conn.access_token;
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID, client_secret: env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token', refresh_token: conn.refresh_token,
    }),
  });
  if (!res.ok) throw new Error('Strava token refresh failed — try reconnecting');
  const t = await res.json();
  await saveConn(env, user, 'strava', { access_token: t.access_token, refresh_token: t.refresh_token, expires_at: t.expires_at });
  return t.access_token;
}

async function stravaActivities(env, user, conn, date) {
  const token = await stravaToken(env, user, conn);
  // Wide UTC window around the date, then filter on Strava's local start time.
  const dayStart = Date.parse(`${date}T00:00:00Z`) / 1000;
  const url = `https://www.strava.com/api/v3/athlete/activities?after=${dayStart - 16 * 3600}&before=${dayStart + 40 * 3600}&per_page=50`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Strava error ${res.status}`);
  const list = await res.json();
  return list
    .filter((a) => (a.start_date_local || '').startsWith(date))
    .map((a) => ({
      provider: 'strava',
      external_id: String(a.id),
      name: a.name,
      activity_type: a.sport_type || a.type,
      start_local: a.start_date_local.slice(0, 16),
      duration_sec: a.elapsed_time, // total recorded time, not just moving time
      distance_m: a.distance || null,
      outdoor_hint: a.trainer ? 0 : (a.start_latlng && a.start_latlng.length ? 1 : null),
    }));
}

// ---------- Hevy (API key from Hevy app → Settings → Developer, needs Hevy Pro) ----------

export async function hevyConnect(env, user, apiKey) {
  const res = await fetch('https://api.hevyapp.com/v1/workouts?page=1&pageSize=1', {
    headers: { 'api-key': apiKey }, signal: AbortSignal.timeout(15000),
  }).catch(() => { throw new Error("Couldn't reach Hevy — try again"); });
  if (!res.ok) throw new Error('Hevy rejected that API key');
  await saveConn(env, user, 'hevy', { api_key: apiKey });
}

async function hevyActivities(env, conn, date, tz) {
  const out = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://api.hevyapp.com/v1/workouts?page=${page}&pageSize=10`, { headers: { 'api-key': conn.api_key } });
    if (!res.ok) {
      if (res.status === 404) break; // past the last page
      throw new Error(`Hevy error ${res.status}`);
    }
    const data = await res.json();
    const workouts = data.workouts || [];
    let olderSeen = false;
    for (const w of workouts) {
      const startMs = Date.parse(w.start_time);
      const endMs = Date.parse(w.end_time);
      const startLocal = toLocal(startMs, tz);
      if (startLocal.slice(0, 10) < date) olderSeen = true;
      if (!startLocal.startsWith(date)) continue;
      out.push({
        provider: 'hevy',
        external_id: String(w.id),
        name: w.title || 'Hevy workout',
        activity_type: 'Strength',
        start_local: startLocal,
        duration_sec: Math.max(0, Math.round((endMs - startMs) / 1000)),
        distance_m: null,
        outdoor_hint: 0,
      });
    }
    if (olderSeen || !workouts.length || page >= (data.page_count || 1)) break;
  }
  return out;
}

// ---------- Garmin (Garmin Connect Developer Program: OAuth2 PKCE + Activity push API) ----------

export async function garminStart(env, user, origin) {
  const verifier = randomToken(48);
  const url = new URL('https://connect.garmin.com/oauth2Confirm');
  url.search = new URLSearchParams({
    client_id: env.GARMIN_CLIENT_ID,
    response_type: 'code',
    code_challenge: await sha256b64url(verifier),
    code_challenge_method: 'S256',
    redirect_uri: `${origin}/api/oauth/garmin/callback`,
    state: await makeState(env, user),
  });
  return new Response(null, {
    status: 302,
    headers: { Location: url.toString(), 'Set-Cookie': cookie('h75_gv', verifier, 600) },
  });
}

export async function garminCallback(env, url, request) {
  const user = await readState(env, url.searchParams.get('state'));
  const code = url.searchParams.get('code');
  const verifier = getCookie(request, 'h75_gv');
  const fail = Response.redirect(`${url.origin}/#/settings?error=garmin`, 302);
  if (!user || !code || !verifier) return fail;
  const res = await fetch('https://diauth.garmin.com/di-oauth2-service/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code', client_id: env.GARMIN_CLIENT_ID, client_secret: env.GARMIN_CLIENT_SECRET,
      code, code_verifier: verifier, redirect_uri: `${url.origin}/api/oauth/garmin/callback`,
    }),
  });
  if (!res.ok) return fail;
  const t = await res.json();
  let garminUserId = null;
  const idRes = await fetch('https://apis.garmin.com/wellness-api/rest/user/id', { headers: { Authorization: `Bearer ${t.access_token}` } });
  if (idRes.ok) garminUserId = (await idRes.json()).userId;
  await saveConn(env, user, 'garmin', {
    access_token: t.access_token, refresh_token: t.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (t.expires_in || 86400), external_user_id: garminUserId,
  });
  // Ask Garmin to push the last 30 days of activities to our webhook.
  const end = Math.floor(Date.now() / 1000);
  await fetch(
    `https://apis.garmin.com/wellness-api/rest/backfill/activities?summaryStartTimeInSeconds=${end - 30 * 86400}&summaryEndTimeInSeconds=${end}`,
    { headers: { Authorization: `Bearer ${t.access_token}` } },
  ).catch(() => {});
  return new Response(null, {
    status: 302,
    headers: { Location: `${url.origin}/#/settings?connected=garmin`, 'Set-Cookie': cookie('h75_gv', '', 0) },
  });
}

async function garminToken(env, user, conn) {
  if (conn.expires_at && conn.expires_at > Date.now() / 1000 + 120) return conn.access_token;
  const res = await fetch('https://diauth.garmin.com/di-oauth2-service/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token', client_id: env.GARMIN_CLIENT_ID, client_secret: env.GARMIN_CLIENT_SECRET,
      refresh_token: conn.refresh_token,
    }),
  });
  if (!res.ok) throw new Error('Garmin token refresh failed — try reconnecting');
  const t = await res.json();
  await saveConn(env, user, 'garmin', {
    access_token: t.access_token, refresh_token: t.refresh_token || conn.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (t.expires_in || 86400),
  });
  return t.access_token;
}

function normalizeGarmin(a) {
  const type = a.activityType || '';
  const indoor = /INDOOR|TREADMILL|VIRTUAL|STRENGTH|YOGA|ELLIPTICAL|STAIR|PILATES|CARDIO/i.test(type);
  return {
    provider: 'garmin',
    external_id: String(a.summaryId || a.activityId),
    name: a.activityName || type.replace(/_/g, ' ').toLowerCase() || 'Garmin activity',
    activity_type: type,
    // startTimeInSeconds is UTC; adding the offset gives local wall-clock time.
    start_local: new Date((a.startTimeInSeconds + (a.startTimeOffsetInSeconds || 0)) * 1000).toISOString().slice(0, 16),
    duration_sec: a.durationInSeconds || 0,
    distance_m: a.distanceInMeters || null,
    outdoor_hint: indoor ? 0 : (a.distanceInMeters ? 1 : null),
  };
}

// Garmin push/ping webhook. Configure in the Garmin developer portal:
//   Activity summaries → https://<your-domain>/api/garmin/push
export async function garminWebhook(env, body) {
  const items = [...(body.activities || []), ...(body.manuallyUpdatedActivities || [])];
  for (const item of items) {
    const conn = await env.DB.prepare("SELECT * FROM connections WHERE provider = 'garmin' AND external_user_id = ?")
      .bind(String(item.userId)).first();
    if (!conn) continue;
    if (item.callbackURL) {
      // Ping mode: pull the data from the callback URL.
      const token = await garminToken(env, conn.user_id, conn);
      const res = await fetch(item.callbackURL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const list = await res.json();
        await cacheActivities(env, conn.user_id, (Array.isArray(list) ? list : []).map(normalizeGarmin));
      }
    } else if (item.startTimeInSeconds) {
      await cacheActivities(env, conn.user_id, [normalizeGarmin(item)]);
    }
  }
  // User revoked access from Garmin Connect
  for (const d of body.deregistrations || []) {
    await env.DB.prepare("DELETE FROM connections WHERE provider = 'garmin' AND external_user_id = ?").bind(String(d.userId)).run();
  }
}

export async function garminDisconnect(env, conn) {
  await fetch('https://apis.garmin.com/wellness-api/rest/user/registration', {
    method: 'DELETE', headers: { Authorization: `Bearer ${conn.access_token}` },
  }).catch(() => {});
}

// ---------- Aggregate ----------

export async function listActivities(env, user, date, tz) {
  const { results: conns } = await env.DB.prepare('SELECT * FROM connections WHERE user_id = ?').bind(user).all();
  const errors = {};
  const fetched = [];
  for (const conn of conns) {
    try {
      if (conn.provider === 'strava') fetched.push(...await stravaActivities(env, user, conn, date));
      if (conn.provider === 'hevy') fetched.push(...await hevyActivities(env, conn, date, tz));
    } catch (e) {
      errors[conn.provider] = e.message;
    }
  }
  await cacheActivities(env, user, fetched);
  // Garmin activities arrive via webhook; everything is read back from the cache.
  const { results } = await env.DB.prepare(
    `SELECT e.*, w.id AS workout_id, w.block AS added_to_block
     FROM external_activities e
     LEFT JOIN workouts w ON w.source = e.provider AND w.external_id = e.external_id AND w.user_id = e.user_id
     WHERE e.user_id = ? AND substr(e.start_local, 1, 10) = ?
     ORDER BY e.start_local`,
  ).bind(user, date).all();
  return { activities: results, connected: conns.map((c) => c.provider), errors };
}

export { getConn, saveConn };
