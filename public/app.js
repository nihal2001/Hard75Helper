// Hard 75 tracker — single-page app (no build step).

// ---------- Icons (lucide-style strokes) ----------
const P = {
  dumbbell: '<path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  tree: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  today: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  settings: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  import: '<path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/>',
  note: '<path d="M12 20h9"/><path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 86400000);
const fmtDate = (s, opts = { weekday: 'short', month: 'short', day: 'numeric' }) => new Date(s + 'T12:00:00').toLocaleDateString(undefined, opts);
const fmtTime = (local) => { const [h, m] = local.slice(11, 16).split(':').map(Number); return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`; };
const fmtDur = (sec) => { const m = Math.round(sec / 60); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const haptic = () => navigator.vibrate?.(8);

const UNITS = { oz: 29.5735, mL: 1, L: 1000, cup: 236.588, gal: 3785.41 };
const ML_PER_OZ = UNITS.oz;
const fmtOz = (ml) => `${Math.round(ml / ML_PER_OZ)} oz`;
const fmtL = (ml) => `${(ml / 1000).toFixed(ml >= 10000 ? 0 : 1)} L`;
const SRC_LABEL = { strava: 'STR', garmin: 'GAR', hevy: 'HEVY', manual: icon('dumbbell') };
const SRC_NAME = { strava: 'Strava', garmin: 'Garmin', hevy: 'Hevy', manual: 'Manual' };

let toastTimer;
function toast(msg, isError = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'show' + (isError ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = ''), isError ? 3500 : 1600);
}

async function api(path, opts = {}) {
  const init = { method: opts.method || 'GET', headers: {}, credentials: 'same-origin' };
  if (opts.form) init.body = opts.form;
  else if (opts.body !== undefined) { init.body = JSON.stringify(opts.body); init.headers['Content-Type'] = 'application/json'; }
  const res = await fetch('/api' + path, init);
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null;
  if (res.status === 401 && path !== '/login') { state.me = null; renderLogin(); throw new Error('Please log in'); }
  if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
  return data;
}

// Run an action, show errors as toasts
async function run(fn, okMsg) {
  try {
    const r = await fn();
    if (okMsg) toast(okMsg);
    return r;
  } catch (e) {
    toast(e.message, true);
  }
}

// Downscale photos before upload (keeps R2 small and uploads fast on mobile data)
async function compressImage(file, maxDim = 1600, quality = 0.82) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality));
    return blob || file;
  } catch {
    return file; // unsupported format in this browser: upload as-is
  }
}

async function uploadPhotos(files, kind, date) {
  const list = [...files];
  if (!list.length) return;
  toast(list.length > 1 ? `Uploading ${list.length} photos…` : 'Uploading…');
  for (const f of list) {
    const blob = await compressImage(f);
    const form = new FormData();
    form.append('file', blob, 'photo.jpg');
    form.append('kind', kind);
    form.append('date', date);
    await api('/photos', { method: 'POST', form });
  }
}

// ---------- State ----------
const state = {
  me: null, users: [], rules: null, providers: {},
  view: (() => { try { return localStorage.getItem('h75-view'); } catch { return null; } })(), // which person is being viewed
  date: todayStr(),
  day: null,
  units: [],
  summary: null,
};
const userName = (id) => state.users.find((u) => u.id === id)?.name || id;
const userCfg = (id) => state.users.find((u) => u.id === id) || {};
const canEdit = () => state.view === state.me;

function setView(u) {
  state.view = u;
  try { localStorage.setItem('h75-view', u); } catch {}
  document.body.dataset.person = u;
}

// ---------- Router ----------
function parseHash() {
  const [path, query = ''] = location.hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean);
  return { parts, q: new URLSearchParams(query) };
}

async function route() {
  if (!state.me) return;
  closeSheet();
  closeViewer();
  const { parts, q } = parseHash();
  const page = parts[0] || 'day';
  if (page === 'day') {
    if (parts[1] && /^\d{4}-\d{2}-\d{2}$/.test(parts[1])) state.date = parts[1];
    if (parts[2] && userCfg(parts[2]).id) setView(parts[2]);
    return renderDay();
  }
  if (page === 'history') return renderHistory();
  if (page === 'photos') { if (parts[1] && userCfg(parts[1]).id) setView(parts[1]); return renderPhotos(); }
  if (page === 'settings') {
    if (q.get('connected')) toast(`${SRC_NAME[q.get('connected')] || 'Account'} connected`);
    if (q.get('error')) toast(`Couldn't connect ${SRC_NAME[q.get('error')] || 'account'}`, true);
    if (q.get('connected') || q.get('error')) history.replaceState(null, '', '#/settings');
    return renderSettings();
  }
  location.hash = '#/day';
}
window.addEventListener('hashchange', route);

const dayHash = (date = state.date, u = state.view) => `#/day/${date}/${u}`;

function shell(tab, content) {
  $('#app').innerHTML = `
    <main class="screen">${content}</main>
    <nav class="tabbar">
      <a href="${dayHash(tab === 'day' ? state.date : todayStr())}" class="${tab === 'day' ? 'on' : ''}">${icon('today')}Day</a>
      <a href="#/history" class="${tab === 'history' ? 'on' : ''}">${icon('grid')}History</a>
      <a href="#/photos/${state.view}" class="${tab === 'photos' ? 'on' : ''}">${icon('image')}Photos</a>
      <a href="#/settings" class="${tab === 'settings' ? 'on' : ''}">${icon('settings')}Settings</a>
    </nav>`;
}

function personSeg() {
  return `<div class="seg person">${state.users.map((u) => `
    <button data-action="view-user" data-u="${u.id}" class="${state.view === u.id ? 'on' : ''}">
      ${esc(u.name)}${u.id === state.me ? '<span class="you">you</span>' : ''}
    </button>`).join('')}</div>`;
}

// ---------- Day view ----------
function dayNumber(date, settings) {
  if (!settings?.start_date) return null;
  const n = daysBetween(settings.start_date, date) + 1;
  return n >= 1 ? n : null;
}

async function loadDay() {
  state.day = await api(`/day?user=${state.view}&date=${state.date}`);
}

async function renderDay() {
  const wantKey = `${state.view}|${state.date}`;
  if (!state.day || `${state.day.user}|${state.day.date}` !== wantKey) {
    shell('day', dayHeader(null) + '<div class="loading"><div class="spinner"></div></div>');
    try { await loadDay(); } catch (e) { toast(e.message, true); return; }
    if (`${state.view}|${state.date}` !== wantKey) return; // navigated away meanwhile
  }
  paintDay();
}

function dayHeader(d) {
  const n = d ? dayNumber(state.date, d.settings) : null;
  const isToday = state.date === todayStr();
  const days = state.rules?.days || 75;
  return `
    <div class="topbar">
      <div class="topbar-row">${personSeg()}</div>
      <div class="daynav">
        <button class="iconbtn" data-action="day-prev" aria-label="Previous day">${icon('left')}</button>
        <label class="datebtn">
          <strong>${isToday ? 'Today' : fmtDate(state.date)}</strong>
          <small>${n ? (n <= days ? `Day ${n} of ${days}` : `Day ${n} · challenge done`) : (isToday ? fmtDate(state.date) : '&nbsp;')}</small>
          <input type="date" value="${state.date}" data-action="pick-date" aria-label="Pick a date" />
        </label>
        <button class="iconbtn" data-action="day-next" aria-label="Next day" ${state.date >= todayStr() ? 'disabled' : ''}>${icon('right')}</button>
        ${isToday ? '' : '<button class="todaybtn" data-action="day-today">Today</button>'}
      </div>
    </div>`;
}

function paintDay() {
  const d = state.day;
  const s = d.status;
  const edit = canEdit();
  const parts = [
    ['workouts', 'dumbbell', 'Workouts'], ['water', 'droplet', 'Water'], ['reading', 'book', 'Read'],
    ['diet', 'food', 'Diet'], ['photo', 'camera', 'Photo'],
  ];
  const circ = 2 * Math.PI * 24;
  const html = `
    ${dayHeader(d)}
    ${edit ? '' : `<div class="banner">${icon('eye')} Viewing ${esc(userName(state.view))}'s day — read only</div>`}
    <div class="summary">
      <div class="ring">
        <svg viewBox="0 0 58 58"><circle cx="29" cy="29" r="24" fill="none" stroke="var(--surface-2)" stroke-width="6"/>
        <circle cx="29" cy="29" r="24" fill="none" stroke="${s.complete ? 'var(--ok)' : 'var(--accent)'}" stroke-width="6" stroke-linecap="round"
          stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - s.done_count / 5)}" style="transition: stroke-dashoffset .4s"/></svg>
        <div class="count num">${s.done_count}/5</div>
      </div>
      <div class="pills">${parts.map(([k, ic, label]) => `
        <a class="pill ${s.parts[k] ? 'ok' : ''}" href="#sec-${k}" data-action="scroll" data-target="sec-${k}"><span class="ic">${icon(s.parts[k] ? 'check' : ic)}</span>${label}</a>`).join('')}
      </div>
    </div>
    ${workoutsCard(d, edit)}
    ${waterCard(d, edit)}
    ${readingCard(d, edit)}
    ${dietCard(d, edit)}
    ${photoCard(d, edit)}
    ${notesCard(d, edit)}
  `;
  shell('day', html);
  const notesEl = document.getElementById('notes');
  if (notesEl) autoGrow(notesEl);
}

function blockHtml(d, n, edit) {
  const b = d.status.blocks[n];
  const list = d.workouts.filter((w) => w.block === n);
  const goal = state.rules.block_min_sec;
  const pct = Math.min(100, (b.total_sec / goal) * 100);
  const extra = b.total_sec - goal;
  return `
    <div class="block">
      <div class="block-h">
        <strong>Workout ${n}</strong>
        <button class="chip ${b.outdoor ? 'on' : ''}" data-action="toggle-outdoor" data-block="${n}" ${edit ? '' : 'disabled'}
          aria-pressed="${b.outdoor}">${icon('tree')} Outdoor</button>
      </div>
      <div class="bar ${b.done ? 'ok' : ''}"><i style="width:${pct}%"></i></div>
      <div class="block-meta">
        <span class="num"><b>${Math.floor(b.total_sec / 60)}</b> / 45 min</span>
        ${extra > 0 ? `<span class="extra num">+${fmtDur(extra)} extra</span>` : b.done ? '<span class="extra">Done</span>' : ''}
      </div>
      ${list.length ? `<ul class="wlist">${list.map((w) => `
        <li class="wrow">
          <span class="src ${w.source}">${SRC_LABEL[w.source]}</span>
          <div class="grow">
            <div class="name">${esc(w.name)}</div>
            <div class="sub num">${fmtTime(w.start_local)} · ${fmtDur(w.duration_sec)}${w.distance_m ? ` · ${(w.distance_m / 1609.34).toFixed(2)} mi` : ''}</div>
          </div>
          ${edit ? `<button class="x" data-action="del-workout" data-id="${w.id}" aria-label="Remove">${icon('x')}</button>` : ''}
        </li>`).join('')}</ul>` : ''}
      ${edit ? `
      <div class="block-actions">
        <button class="btn" data-action="import" data-block="${n}">${icon('import')} Import</button>
        <button class="btn" data-action="manual" data-block="${n}">${icon('plus')} Manual</button>
      </div>` : list.length ? '' : '<p class="muted small" style="margin:10px 0 0">Nothing logged</p>'}
    </div>`;
}

function workoutsCard(d, edit) {
  const s = d.status;
  const warnings = [];
  const any = d.workouts.length > 0;
  if (any && !s.outdoor_ok) warnings.push('Mark one workout as outdoors');
  const doneBlocks = [1, 2].filter((n) => s.blocks[n].done).length;
  return `
    <section class="card" id="sec-workouts">
      <div class="card-h"><h2>${icon('dumbbell')} Workouts</h2><span class="tag ${s.parts.workouts ? 'ok' : ''}">${doneBlocks}/2</span></div>
      ${blockHtml(d, 1, edit)}
      <div style="height:10px"></div>
      ${blockHtml(d, 2, edit)}
      ${warnings.length ? `<ul class="warnlist">${warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
    </section>`;
}

function waterCard(d, edit) {
  const s = d.status;
  const ml = s.water_ml;
  const goal = s.water_goal_ml;
  const gal = goal / UNITS.gal;
  const goalLabel = Math.abs(gal - 1) < 0.01 ? '1 gallon' : Math.abs(gal - 0.75) < 0.01 ? '¾ gallon' : `${gal.toFixed(2)} gallon`;
  const fill = Math.min(100, s.water_pct);
  const quick = [
    ...state.units.map((u) => ({ label: u.name, ml: u.ml, custom: true })),
    { label: '8 oz', ml: 8 * ML_PER_OZ }, { label: '16 oz', ml: 16 * ML_PER_OZ },
    { label: '500 mL', ml: 500 }, { label: '1 L', ml: 1000 },
  ];
  return `
    <section class="card" id="sec-water">
      <div class="card-h"><h2>${icon('droplet')} Water</h2><span class="tag ${s.parts.water ? 'ok' : ''}">${goalLabel}</span></div>
      <div class="water-top">
        <div class="bottle ${s.parts.water ? 'ok' : ''}"><i style="height:${fill}%"></i></div>
        <div>
          <div class="water-pct num">${s.water_pct}%</div>
          <div class="water-sub num">${fmtOz(ml)} of ${fmtOz(goal)} · ${fmtL(ml)}</div>
          ${!s.parts.water && ml > 0 ? `<div class="water-sub num">${fmtOz(goal - ml)} to go</div>` : ''}
        </div>
      </div>
      ${edit ? `
      <div class="quick">
        ${quick.map((q) => `<button class="chip ${q.custom ? 'custom' : ''}" data-action="water-add" data-ml="${q.ml}" data-label="${esc(q.label)}">+ ${esc(q.label)}</button>`).join('')}
        <button class="chip" data-action="water-other">Other…</button>
      </div>` : ''}
      ${d.water.length ? `
      <details class="log">
        <summary>${d.water.length} entr${d.water.length === 1 ? 'y' : 'ies'} ▾</summary>
        <ul class="log-list">${d.water.map((w) => `
          <li><span>${esc(w.label || fmtOz(w.amount_ml))} <span class="muted small num">${new Date(w.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></span>
          <span class="row"><span class="muted num">${fmtOz(w.amount_ml)}</span>${edit ? `<button class="x" data-action="del-water" data-id="${w.id}" aria-label="Remove">${icon('x')}</button>` : ''}</span></li>`).join('')}
        </ul>
      </details>` : ''}
    </section>`;
}

function readingCard(d, edit) {
  const day = d.day || {};
  const book = day.book_title || '';
  const pages = day.pages_read ?? '';
  return `
    <section class="card" id="sec-reading">
      <div class="card-h"><h2>${icon('book')} Reading</h2><span class="tag ${d.status.parts.reading ? 'ok' : ''}">${state.rules.min_pages} pages</span></div>
      <div class="field">
        <label for="book">Book</label>
        <input id="book" data-field="book_title" value="${esc(book)}" placeholder="${edit ? 'What are you reading?' : 'Not logged'}" ${edit ? '' : 'disabled'} autocomplete="off" enterkeyhint="done" />
        ${edit && !book && d.last_book ? `<div class="suggest"><button class="chip" data-action="same-book" data-book="${esc(d.last_book)}">${icon('book')} ${esc(d.last_book)}</button></div>` : ''}
      </div>
      <div class="field" style="margin-bottom:0">
        <label for="pages">Pages read</label>
        <div class="stepper">
          ${edit ? `<button class="iconbtn" data-action="pages-step" data-step="-1" aria-label="Fewer pages">${icon('minus')}</button>` : ''}
          <input id="pages" data-field="pages_read" type="number" inputmode="numeric" min="0" value="${pages}" placeholder="0" ${edit ? '' : 'disabled'} />
          ${edit ? `<button class="iconbtn" data-action="pages-step" data-step="1" aria-label="More pages">${icon('plus')}</button>` : ''}
        </div>
      </div>
    </section>`;
}

function yn(field, value, edit, goodIsYes = true) {
  const btn = (v, label) => {
    const on = value === v;
    const good = goodIsYes ? v === 1 : v === 0;
    return `<button class="${on ? `on ${good ? 'good' : 'bad'}` : ''}" data-action="yn" data-field="${field}" data-value="${v}" ${edit ? '' : 'disabled'}>${label}</button>`;
  };
  return `<div class="yn">${btn(1, 'Yes')}${btn(0, 'No')}</div>`;
}

function dietCard(d, edit) {
  const day = d.day || {};
  const cfg = userCfg(state.view);
  let extra = '';
  if (cfg.diet === 'nosugar') {
    extra = `<div class="q"><span class="qlabel">Did you eat any sugar?</span>${yn('sugar_eaten', day.sugar_eaten ?? null, edit, false)}</div>`;
  } else {
    const total = d.food.reduce((s, f) => s + f.calories, 0);
    const goal = d.settings?.calorie_goal;
    extra = `
      <div class="q">
        <span class="qlabel">Calories</span>
        <div class="cal-total"><b class="num">${total.toLocaleString()}</b><span class="muted num">${goal ? `/ ${goal.toLocaleString()} kcal` : 'kcal'}</span></div>
        ${goal ? `<div class="bar ${total > goal ? '' : 'ok'}" style="margin-bottom:10px"><i style="width:${Math.min(100, (total / goal) * 100)}%;${total > goal ? 'background:var(--bad)' : ''}"></i></div>` : ''}
        ${edit ? `
        <form class="row" data-form="food" style="margin-top:8px">
          <input name="wname" placeholder="Food" autocomplete="off" style="flex:2" />
          <input name="calories" type="number" inputmode="numeric" placeholder="kcal" style="flex:1" required />
          <button class="iconbtn" type="submit" aria-label="Add calories" style="background:var(--accent);color:#fff">${icon('plus')}</button>
        </form>` : ''}
        ${d.food.length ? `<ul class="log-list">${d.food.map((f) => `
          <li><span>${esc(f.name || 'Food')}</span><span class="row"><span class="muted num">${f.calories}</span>${edit ? `<button class="x" data-action="del-food" data-id="${f.id}" aria-label="Remove">${icon('x')}</button>` : ''}</span></li>`).join('')}</ul>` : ''}
      </div>`;
  }
  return `
    <section class="card" id="sec-diet">
      <div class="card-h"><h2>${icon('food')} Diet</h2><span class="tag ${d.status.parts.diet ? 'ok' : ''}">${cfg.diet === 'nosugar' ? 'No sugar' : 'Calories'}</span></div>
      <div class="q"><span class="qlabel">Did you stick to your diet?</span>${yn('diet_held', day.diet_held ?? null, edit, true)}</div>
      ${extra}
      <span class="qlabel">Meals</span>
      <div class="thumbs">
        ${d.meal_photos.map((p, i) => `<button class="thumb" data-action="view-photo" data-set="meal" data-i="${i}"><img src="/api/photos/${p.id}" loading="lazy" alt="Meal photo" /></button>`).join('')}
        ${edit ? `<label class="thumb add" aria-label="Add meal photos">${icon('plus')}<input class="file-hidden" type="file" accept="image/*" multiple data-upload="meal" /></label>` : ''}
      </div>
      ${!edit && !d.meal_photos.length ? '<p class="muted small" style="margin:0">No meal photos</p>' : ''}
    </section>`;
}

function notesCard(d, edit) {
  const notes = d.day?.notes || '';
  if (!edit && !notes) {
    return `
    <section class="card" id="sec-notes">
      <div class="card-h"><h2>${icon('note')} Notes</h2></div>
      <p class="muted small" style="margin:0">No notes for this day</p>
    </section>`;
  }
  return `
    <section class="card" id="sec-notes">
      <div class="card-h"><h2>${icon('note')} Notes</h2><span class="muted small" id="notes-state"></span></div>
      <textarea id="notes" data-field="notes" rows="4" maxlength="5000" placeholder="How did today go? Thoughts, wins, struggles…" ${edit ? '' : 'readonly'}>${esc(notes)}</textarea>
    </section>`;
}

// Notes save as you type (without repainting, so the keyboard and cursor stay put)
let notesTimer;
async function saveNotes(el, date) {
  const v = el.value.trim();
  if (!state.day || state.day.date !== date || !canEdit() || (state.day.day?.notes || '') === v) return;
  const label = document.getElementById('notes-state');
  try {
    const d = await api('/day', { method: 'PUT', body: { date, notes: v } });
    if (state.day?.date === date && state.day.user === d.user) state.day.day = d.day;
    if (label) label.textContent = 'Saved';
  } catch (e) {
    toast(e.message, true);
  }
}
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight + 2}px`;
}
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.id !== 'notes') return;
  autoGrow(el);
  const label = document.getElementById('notes-state');
  if (label) label.textContent = '';
  const date = state.date;
  clearTimeout(notesTimer);
  notesTimer = setTimeout(() => saveNotes(el, date), 1000);
});
document.addEventListener('focusout', (e) => {
  if (e.target.id !== 'notes') return;
  clearTimeout(notesTimer);
  saveNotes(e.target, state.date);
});

function photoCard(d, edit) {
  const photos = d.progress_photos;
  const latest = photos[photos.length - 1];
  return `
    <section class="card" id="sec-photo">
      <div class="card-h"><h2>${icon('camera')} Progress photo</h2><a class="linkbtn" href="#/photos/${state.view}">All photos</a></div>
      ${latest ? `
        <button class="progress-photo" style="width:100%" data-action="view-photo" data-set="progress" data-i="${photos.length - 1}">
          <img src="/api/photos/${latest.id}" alt="Progress photo" />
        </button>
        ${edit ? `<div class="row" style="margin-top:10px">
          <label class="btn">${icon('camera')} Retake<input class="file-hidden" type="file" accept="image/*" capture="user" data-upload="progress" /></label>
          <label class="btn">${icon('upload')} Upload<input class="file-hidden" type="file" accept="image/*" data-upload="progress" /></label>
        </div>` : ''}` : `
        <div class="progress-empty">
          ${icon('camera')}
          <span>${edit ? "Today's progress picture" : 'No photo yet'}</span>
          ${edit ? `<div class="row" style="width:100%">
            <label class="btn primary">${icon('camera')} Take photo<input class="file-hidden" type="file" accept="image/*" capture="user" data-upload="progress" /></label>
            <label class="btn">${icon('upload')} Upload<input class="file-hidden" type="file" accept="image/*" data-upload="progress" /></label>
          </div>` : ''}
        </div>`}
    </section>`;
}

// ---------- Day mutations ----------
async function saveDay(fields, msg = 'Saved') {
  const d = await run(() => api('/day', { method: 'PUT', body: { date: state.date, ...fields } }), msg);
  if (d) { state.day = d; paintDay(); }
}

async function mutate(path, method, body, msg) {
  const d = await run(() => api(path, { method, body }), msg);
  if (d) { state.day = d; paintDay(); }
  return d;
}

// ---------- Sheets ----------
function openSheet(html, onMount) {
  const root = $('#sheet-root');
  root.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  document.body.style.overflow = 'hidden';
  onMount?.($('.sheet', root));
}
function closeSheet() {
  $('#sheet-root').innerHTML = '';
  document.body.style.overflow = '';
}

function manualSheet(block) {
  const presets = ['Run', 'Walk', 'Lift', 'Bike', 'Hike', 'Yoga', 'Swim', 'HIIT'];
  const outdoorDefault = ['Run', 'Walk', 'Bike', 'Hike'];
  const now = new Date();
  const defaultTime = state.date === todayStr() ? `${pad(Math.max(0, now.getHours() - 1))}:${pad(now.getMinutes())}` : '07:00';
  openSheet(`
    <h3>Add workout manually</h3>
    <form data-form="manual">
      <div class="presets">${presets.map((p) => `<button type="button" class="chip" data-preset="${p}">${p}</button>`).join('')}</div>
      <div class="field"><label>Name</label><input name="wname" placeholder="e.g. Morning run" required autocomplete="off" /></div>
      <div class="row">
        <div class="field" style="flex:1"><label>Start time</label><input name="time" type="time" value="${defaultTime}" required /></div>
        <div class="field" style="flex:1"><label>Minutes</label><input name="mins" type="number" inputmode="numeric" value="45" min="1" required /></div>
      </div>
      <div class="field"><label>Workout block</label>
        <div class="seg" data-seg="block">${[1, 2].map((n) => `<button type="button" data-v="${n}" class="${n === block ? 'on' : ''}">Workout ${n}</button>`).join('')}</div>
      </div>
      <label class="chip" style="margin-top:4px"><input type="checkbox" name="outdoor" style="width:auto;min-height:0" /> ${icon('tree')} This was outdoors</label>
      <div class="actions"><button type="button" class="btn" data-action="close-sheet">Cancel</button><button class="btn primary" type="submit">Add</button></div>
    </form>`, (sheet) => {
    const form = $('form', sheet);
    sheet.addEventListener('click', (e) => {
      const p = e.target.closest('[data-preset]');
      if (p) {
        form.wname.value = p.dataset.preset;
        form.outdoor.checked = outdoorDefault.includes(p.dataset.preset);
        sheet.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('on', b === p));
      }
      const s = e.target.closest('[data-seg] button');
      if (s) s.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === s));
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const blk = Number($('[data-seg="block"] .on', sheet).dataset.v);
      const d = await mutate('/workouts', 'POST', {
        date: state.date, block: blk, source: 'manual', name: form.wname.value,
        start_local: `${state.date}T${form.time.value}`, duration_min: Number(form.mins.value), outdoor: form.outdoor.checked,
      }, 'Workout added');
      if (d) closeSheet();
    });
  });
}

async function importSheet(block) {
  openSheet(`<h3>Import for Workout ${block}</h3><div id="acts"><div class="loading" style="min-height:120px"><div class="spinner"></div></div></div>`);
  const data = await run(() => api(`/activities?date=${state.date}&tz=${encodeURIComponent(tz)}`));
  const box = $('#acts');
  if (!box || !data) return;
  if (!data.connected.length) {
    box.innerHTML = `<div class="empty">No apps connected yet.<br/><br/><a class="btn primary" href="#/settings" data-action="close-sheet">Connect Strava, Garmin or Hevy</a></div>`;
    return;
  }
  const errs = Object.entries(data.errors).map(([p, m]) => `<p class="help" style="color:var(--warn)">${SRC_NAME[p]}: ${esc(m)}</p>`).join('');
  const bothOutdoorUnset = !state.day.status.blocks[1].outdoor && !state.day.status.blocks[2].outdoor;
  box.innerHTML = errs + (data.activities.length ? data.activities.map((a) => `
    <div class="act-row">
      <span class="src ${a.provider}">${SRC_LABEL[a.provider]}</span>
      <div class="grow" style="flex:1;min-width:0">
        <div class="name" style="font-weight:600">${esc(a.name)}</div>
        <div class="sub muted small num">${fmtTime(a.start_local)} · ${fmtDur(a.duration_sec)}${a.distance_m ? ` · ${(a.distance_m / 1609.34).toFixed(2)} mi` : ''}${a.outdoor_hint === 1 ? ' · outdoor' : ''}</div>
      </div>
      <div class="btns">${a.workout_id ? `<span class="tag ok">In workout ${a.added_to_block}</span>` : `
        <button class="btn ${block === 1 ? 'primary' : ''}" data-action="add-activity" data-src="${a.provider}" data-ext="${esc(a.external_id)}" data-block="1" data-outdoor="${a.outdoor_hint === 1 && bothOutdoorUnset ? 1 : 0}">+ W1</button>
        <button class="btn ${block === 2 ? 'primary' : ''}" data-action="add-activity" data-src="${a.provider}" data-ext="${esc(a.external_id)}" data-block="2" data-outdoor="${a.outdoor_hint === 1 && bothOutdoorUnset ? 1 : 0}">+ W2</button>`}
      </div>
    </div>`).join('') : `<div class="empty">No activities found on ${fmtDate(state.date)} from ${data.connected.map((c) => SRC_NAME[c]).join(', ')}.${data.connected.includes('garmin') ? '<br/>Garmin activities appear a few minutes after syncing your watch.' : ''}</div>`);
}

function waterOtherSheet() {
  const unitOpts = [...Object.keys(UNITS).map((u) => `<option value="std:${u}">${u}</option>`),
    ...state.units.map((u) => `<option value="cu:${u.id}">${esc(u.name)}</option>`)].join('');
  openSheet(`
    <h3>Add water</h3>
    <form data-form="water-other">
      <div class="row">
        <div class="field" style="flex:1"><label>Amount</label><input name="amount" type="number" inputmode="decimal" step="any" min="0" placeholder="12" required autofocus /></div>
        <div class="field" style="flex:1"><label>Unit</label><select name="unit">${unitOpts}</select></div>
      </div>
      <label class="chip"><input type="checkbox" name="subtract" style="width:auto;min-height:0" /> Subtract instead (fix a mistake)</label>
      <div class="actions"><button type="button" class="btn" data-action="units-sheet">Custom units</button><button class="btn primary" type="submit">Add</button></div>
    </form>`, (sheet) => {
    const form = $('form', sheet);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const amt = Number(form.amount.value);
      const [kind, v] = form.unit.value.split(':');
      let ml, label;
      if (kind === 'std') { ml = amt * UNITS[v]; label = `${amt} ${v}`; }
      else { const u = state.units.find((x) => String(x.id) === v); ml = amt * u.ml; label = `${amt} × ${u.name}`; }
      if (form.subtract.checked) { ml = -ml; label = `− ${label}`; }
      const d = await mutate('/water', 'POST', { date: state.date, amount_ml: ml, label }, 'Water logged');
      if (d) closeSheet();
    });
  });
}

function unitsSheet() {
  const draw = () => `
    <h3>Custom water units</h3>
    <p class="help" style="margin-top:-8px;margin-bottom:12px">Save your bottles so logging is one tap — e.g. “Red Owala = 24 oz”.</p>
    ${state.units.length ? state.units.map((u) => `
      <div class="unit-row"><span><b>${esc(u.name)}</b> <span class="muted num">${fmtOz(u.ml)} · ${Math.round(u.ml)} mL</span></span>
      <button class="x" data-action="del-unit" data-id="${u.id}" aria-label="Delete unit">${icon('trash')}</button></div>`).join('') : '<p class="muted small">No custom units yet.</p>'}
    <form data-form="unit" style="margin-top:14px">
      <div class="field"><label>Name</label><input name="wname" placeholder="Red Owala" required autocomplete="off" /></div>
      <div class="row">
        <div class="field" style="flex:1"><label>Size</label><input name="amount" type="number" inputmode="decimal" step="any" min="0" placeholder="24" required /></div>
        <div class="field" style="flex:1"><label>Unit</label><select name="unit">${Object.keys(UNITS).map((u) => `<option>${u}</option>`).join('')}</select></div>
      </div>
      <div class="actions"><button type="button" class="btn" data-action="close-sheet">Done</button><button class="btn primary" type="submit">Save unit</button></div>
    </form>`;
  openSheet(draw(), function mount(sheet) {
    $('form', sheet).addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const units = await run(() => api('/water-units', { method: 'POST', body: { name: f.wname.value.trim(), ml: Number(f.amount.value) * UNITS[f.unit.value] } }), 'Unit saved');
      if (units) { state.units = units; openSheet(draw(), mount); refreshCurrent(); }
    });
    sheet.addEventListener('click', async (e) => {
      const del = e.target.closest('[data-action="del-unit"]');
      if (!del) return;
      e.stopPropagation();
      const units = await run(() => api(`/water-units/${del.dataset.id}`, { method: 'DELETE' }), 'Unit removed');
      if (units) { state.units = units; openSheet(draw(), mount); refreshCurrent(); }
    });
  });
}

function refreshCurrent() {
  const page = parseHash().parts[0] || 'day';
  if (page === 'day' && state.day) paintDay();
  if (page === 'settings') renderSettings();
}

// ---------- Photo viewer ----------
let viewerCtx = null;
function openViewer(photos, index, { owner, label } = {}) {
  viewerCtx = { photos, index, owner, label };
  drawViewer();
}
function drawViewer() {
  const { photos, index, owner, label } = viewerCtx;
  const p = photos[index];
  let el = $('.viewer');
  if (!el) {
    el = document.createElement('div');
    el.className = 'viewer';
    document.body.appendChild(el);
    let x0 = null;
    el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) stepViewer(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }
  el.innerHTML = `
    <div class="viewer-top">
      <button class="iconbtn" data-action="close-viewer" aria-label="Close">${icon('x')}</button>
      <div style="text-align:center;font-weight:700;font-size:15px">${label ? esc(label(p)) : ''}<div class="small" style="opacity:.6">${index + 1} / ${photos.length}</div></div>
      ${owner ? `<button class="iconbtn" data-action="del-photo" data-id="${p.id}" aria-label="Delete photo">${icon('trash')}</button>` : '<span style="width:44px"></span>'}
    </div>
    <div class="viewer-img"><img src="/api/photos/${p.id}" alt="" /></div>
    <div class="viewer-bottom">
      <button class="iconbtn" data-action="viewer-step" data-step="-1" ${index === 0 ? 'disabled' : ''} aria-label="Previous">${icon('left')}</button>
      <button class="iconbtn" data-action="viewer-step" data-step="1" ${index === photos.length - 1 ? 'disabled' : ''} aria-label="Next">${icon('right')}</button>
    </div>`;
}
function stepViewer(n) {
  const i = viewerCtx.index + n;
  if (i < 0 || i >= viewerCtx.photos.length) return;
  viewerCtx.index = i;
  drawViewer();
}
function closeViewer() { $('.viewer')?.remove(); viewerCtx = null; }

// ---------- History ----------
async function renderHistory() {
  shell('history', `<div class="topbar"><h1 class="title">History</h1></div><div class="loading"><div class="spinner"></div></div>`);
  const today = todayStr();
  const s0 = await run(() => api(`/summary?from=${addDays(today, -1)}&to=${today}`));
  if (!s0) return;
  // Range covers both people's challenge windows (or the last 5 weeks if no start date)
  const starts = Object.values(s0.settings).map((s) => s.start_date).filter(Boolean).sort();
  const from = starts[0] || addDays(today, -34);
  const to = starts.length ? addDays(starts[starts.length - 1], state.rules.days - 1) : today;
  const data = await run(() => api(`/summary?from=${from}&to=${to > today ? to : today}`));
  if (!data || (parseHash().parts[0] || 'day') !== 'history') return;

  const partKeys = ['workouts', 'water', 'reading', 'diet', 'photo'];
  const todayCard = `
    <section class="card">
      <div class="card-h"><h2>Today</h2><span class="muted small">${fmtDate(today)}</span></div>
      <div class="vs">${state.users.map((u) => {
        const t = data.days[u.id][today];
        return `<a href="${dayHash(today, u.id)}"><div class="who ${u.id}">${esc(u.name)}</div>
          <div class="num" style="font-size:24px;font-weight:800">${t?.done_count || 0}/5</div>
          <div class="minidots">${partKeys.map((k) => `<i class="${t?.parts[k] ? 'ok' : ''}"></i>`).join('')}</div></a>`;
      }).join('')}</div>
    </section>`;

  const cards = state.users.map((u) => {
    const days = data.days[u.id];
    const start = data.settings[u.id]?.start_date;
    const total = state.rules.days;
    let cells = [];
    if (start) {
      for (let i = 0; i < total; i++) cells.push({ date: addDays(start, i), n: i + 1 });
    } else {
      for (let i = 34; i >= 0; i--) cells.push({ date: addDays(today, -i), n: Number(addDays(today, -i).slice(8)) });
    }
    let completeCount = 0;
    let streak = 0;
    for (let dt = today; ; dt = addDays(dt, -1)) {
      if (days[dt]?.complete) streak++;
      else if (dt !== today) break;
      if (start && dt <= start) break;
      if (!start && daysBetween(dt, today) > 400) break;
    }
    const grid = cells.map((c) => {
      const s = days[c.date];
      if (s?.complete) completeCount++;
      let cls = 'future';
      let inner = `<span>${c.n}</span>`;
      if (c.date <= today) {
        if (s?.complete) cls = 'complete';
        else if (s && s.done_count > 0) { cls = 'partial'; inner = `<i style="height:${(s.done_count / 5) * 100}%"></i><span>${c.n}</span>`; }
        else cls = c.date < today ? 'missed' : '';
      }
      return `<a class="cell ${cls} ${c.date === today ? 'today' : ''}" href="${dayHash(c.date, u.id)}" title="${fmtDate(c.date)}">${inner}</a>`;
    }).join('');
    const dayN = start ? daysBetween(start, today) + 1 : null;
    return `
      <section class="card hist-card" style="--accent:var(--${u.id})">
        <div class="card-h" style="margin-bottom:0"><h2 style="color:var(--${u.id})">${esc(u.name)}</h2>
          ${start ? `<span class="muted small">Started ${fmtDate(start, { month: 'short', day: 'numeric' })}</span>` : ''}</div>
        <div class="hist-stats">
          <div class="stat"><b class="num">${dayN && dayN > 0 ? Math.min(dayN, total) : '–'}</b><span>Day</span></div>
          <div class="stat"><b class="num">${streak}</b><span>Streak</span></div>
          <div class="stat"><b class="num">${completeCount}</b><span>Complete</span></div>
        </div>
        ${start ? '' : `<p class="help" style="margin:-4px 0 10px">${u.id === state.me ? '<a href="#/settings">Set your start date</a> to see your 75-day grid.' : 'No start date set yet — showing the last 5 weeks.'}</p>`}
        <div class="grid75">${grid}</div>
      </section>`;
  }).join('');

  shell('history', `
    <div class="topbar"><h1 class="title">History</h1></div>
    ${todayCard}
    ${cards}
    <div class="legend">
      <span><i style="background:var(--ok)"></i>Complete</span>
      <span><i style="background:color-mix(in srgb,var(--warn) 45%,transparent)"></i>Partial</span>
      <span><i style="background:color-mix(in srgb,var(--bad) 22%,transparent)"></i>Missed</span>
    </div>`);
}

// ---------- Photos page ----------
async function renderPhotos() {
  const head = `<div class="topbar"><div class="topbar-row">${personSeg()}</div></div>`;
  shell('photos', head + '<div class="loading"><div class="spinner"></div></div>');
  const who = state.view;
  const [photos, sum] = await Promise.all([
    run(() => api(`/photos?user=${who}&kind=progress`)),
    run(() => api(`/summary?from=${todayStr()}&to=${todayStr()}`)),
  ]);
  if (!photos || state.view !== who || (parseHash().parts[0]) !== 'photos') return;
  state.photoList = photos;
  const start = sum?.settings?.[who]?.start_date;
  const label = (p) => `${start && daysBetween(start, p.date) >= 0 ? `Day ${daysBetween(start, p.date) + 1} · ` : ''}${fmtDate(p.date, { month: 'short', day: 'numeric' })}`;
  state.photoLabel = label;
  const first = photos[0];
  const last = photos[photos.length - 1];
  // Newest first in the grid; indexes point into the chronological list for the viewer
  const grid = photos.map((p, i) => ({ p, i })).reverse();
  shell('photos', `
    ${head}
    ${photos.length > 1 ? `
    <section class="card">
      <div class="card-h"><h2>${icon('camera')} Progress</h2><span class="muted small">${photos.length} photos</span></div>
      <div class="compare">
        <figure><button class="progress-photo" style="width:100%" data-action="gallery-open" data-i="0"><img src="/api/photos/${first.id}" alt="First" /></button><figcaption>${esc(label(first))}</figcaption></figure>
        <figure><button class="progress-photo" style="width:100%" data-action="gallery-open" data-i="${photos.length - 1}"><img src="/api/photos/${last.id}" alt="Latest" /></button><figcaption>${esc(label(last))}</figcaption></figure>
      </div>
    </section>` : ''}
    <section class="card">
      ${photos.length ? `<div class="pgrid">${grid.map(({ p, i }) => `
        <button class="thumb" data-action="gallery-open" data-i="${i}"><img src="/api/photos/${p.id}" loading="lazy" alt="" /><span class="lbl">${esc(label(p))}</span></button>`).join('')}</div>`
        : `<div class="empty">No progress photos yet.${who === state.me ? `<br/><br/><a class="btn primary" href="${dayHash(todayStr(), who)}">Take today's photo</a>` : ''}</div>`}
    </section>`);
}

// ---------- Settings ----------
async function renderSettings() {
  const [conns, settingsData] = await Promise.all([
    run(() => api('/connections')),
    run(() => api(`/summary?from=${todayStr()}&to=${todayStr()}`)),
  ]);
  if ((parseHash().parts[0]) !== 'settings') return;
  const mine = settingsData?.settings?.[state.me] || {};
  const connected = new Set((conns?.connections || []).filter((c) => c.user_id === state.me).map((c) => c.provider));
  const prov = conns?.providers || {};
  const connRow = (p, desc) => {
    const on = connected.has(p);
    let action;
    if (on) action = `<button class="btn danger" data-action="disconnect" data-p="${p}">Disconnect</button>`;
    else if (p === 'hevy') action = `<button class="btn primary" data-action="hevy-connect">Connect</button>`;
    else if (prov[p]) action = `<a class="btn primary" href="/api/connect/${p}">Connect</a>`;
    else action = `<span class="tag">Not set up</span>`;
    return `<div class="conn"><span class="src ${p}">${SRC_LABEL[p]}</span>
      <div class="grow"><b>${SRC_NAME[p]}</b><div class="muted small">${on ? '✓ Connected' : desc}</div></div>${action}</div>`;
  };
  const isNeil = userCfg(state.me).diet === 'calories';
  shell('settings', `
    <div class="topbar"><h1 class="title">Settings</h1></div>
    <section class="card">
      <div class="card-h"><h2>Challenge</h2><span class="tag" style="color:var(--accent)">${esc(userName(state.me))}</span></div>
      <div class="field"><label for="start">Day 1 of your Hard 75</label><input id="start" type="date" value="${mine.start_date || ''}" data-setting="start_date" /></div>
      ${isNeil ? `<div class="field"><label for="calgoal">Daily calorie goal</label><input id="calgoal" type="number" inputmode="numeric" placeholder="e.g. 2200" value="${mine.calorie_goal || ''}" data-setting="calorie_goal" /></div>` : ''}
    </section>
    <section class="card">
      <div class="card-h"><h2>${icon('droplet')} Water units</h2><button class="linkbtn" data-action="units-sheet">Edit</button></div>
      ${state.units.length ? state.units.map((u) => `<div class="unit-row"><b>${esc(u.name)}</b><span class="muted num">${fmtOz(u.ml)}</span></div>`).join('') : '<p class="muted small" style="margin:0">Add your bottles (e.g. Red Owala) for one-tap logging.</p>'}
    </section>
    <section class="card">
      <div class="card-h"><h2>${icon('dumbbell')} Connected apps</h2></div>
      ${connRow('strava', 'Import runs, rides & more')}
      ${connRow('garmin', 'Import watch activities')}
      ${connRow('hevy', 'Import lifting sessions')}
      <p class="help">Hevy needs an API key from Hevy → Settings → Developer (Hevy Pro). Tip: if Garmin isn't set up, link Garmin Connect to Strava and your watch workouts will show up through Strava.</p>
    </section>
    <section class="card">
      <div class="card-h"><h2>Install on your phone</h2></div>
      <p class="help" style="margin:0">iPhone: open in Safari → Share → <b>Add to Home Screen</b>.<br/>Android: Chrome menu → <b>Install app</b>.</p>
    </section>
    <button class="btn danger block-w" data-action="logout" style="background:var(--surface)">Log out</button>
  `);
}

function hevySheet() {
  openSheet(`
    <h3>Connect Hevy</h3>
    <form data-form="hevy">
      <div class="field"><label>Hevy API key</label><input name="key" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Paste your API key" required /></div>
      <p class="help">In the Hevy app go to Settings → Developer to get your key (requires Hevy Pro).</p>
      <div class="actions"><button type="button" class="btn" data-action="close-sheet">Cancel</button><button class="btn primary" type="submit">Connect</button></div>
    </form>`, (sheet) => {
    $('form', sheet).addEventListener('submit', async (e) => {
      e.preventDefault();
      const ok = await run(() => api('/connect/hevy', { method: 'POST', body: { api_key: e.target.key.value } }), 'Hevy connected');
      if (ok) { closeSheet(); renderSettings(); }
    });
  });
}

// ---------- Login ----------
function renderLogin() {
  let who = ''; try { who = localStorage.getItem('h75-last-user') || ''; } catch {}
  $('#app').innerHTML = `
    <div class="login">
      <div class="logo"><img src="/icons/icon-192.png" alt="" /><h1>Hard 75</h1></div>
      <p class="muted" style="margin:0 0 12px">Who's logging in?</p>
      <div class="who-pick">
        <button data-u="dylan" class="${who === 'dylan' ? 'on' : ''}">Dhruv</button>
        <button data-u="neil" class="${who === 'neil' ? 'on' : ''}">Nihal</button>
      </div>
      <form id="login">
        <input name="password" type="password" placeholder="Password" autocomplete="current-password" required />
        <button class="btn primary block-w" style="margin-top:10px" type="submit">Log in</button>
        <div class="err" id="login-err"></div>
      </form>
    </div>`;
  document.body.dataset.person = who || 'dylan';
  $('.who-pick').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    who = b.dataset.u;
    document.body.dataset.person = who;
    $('.who-pick').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    $('#login').password.focus();
  });
  $('#login').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!who) { $('#login-err').textContent = 'Pick Dhruv or Nihal'; return; }
    try {
      await api('/login', { method: 'POST', body: { user: who, password: e.target.password.value } });
      try { localStorage.setItem('h75-last-user', who); } catch {}
      await boot();
    } catch (err) {
      $('#login-err').textContent = err.message;
    }
  });
}

// ---------- Global event handling ----------
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const a = el.dataset.action;
  switch (a) {
    case 'view-user': {
      setView(el.dataset.u);
      const page = parseHash().parts[0] || 'day';
      if (page === 'photos') location.hash = `#/photos/${el.dataset.u}`;
      else location.hash = dayHash();
      break;
    }
    case 'day-prev': location.hash = dayHash(addDays(state.date, -1)); break;
    case 'day-next': location.hash = dayHash(addDays(state.date, 1)); break;
    case 'day-today': location.hash = dayHash(todayStr()); break;
    case 'scroll': {
      e.preventDefault();
      const t = document.getElementById(el.dataset.target);
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' });
      break;
    }
    case 'toggle-outdoor': {
      haptic();
      const n = el.dataset.block;
      await saveDay({ [`block${n}_outdoor`]: !state.day.status.blocks[n].outdoor });
      break;
    }
    case 'manual': manualSheet(Number(el.dataset.block)); break;
    case 'import': importSheet(Number(el.dataset.block)); break;
    case 'add-activity': {
      el.disabled = true;
      const d = await mutate('/workouts', 'POST', {
        date: state.date, block: Number(el.dataset.block), source: el.dataset.src, external_id: el.dataset.ext,
        outdoor: el.dataset.outdoor === '1',
      }, 'Workout added');
      if (d) closeSheet(); else el.disabled = false;
      break;
    }
    case 'del-workout':
      if (confirm('Remove this workout?')) await mutate(`/workouts/${el.dataset.id}`, 'DELETE', undefined, 'Removed');
      break;
    case 'water-add':
      haptic();
      el.disabled = true;
      if (!(await mutate('/water', 'POST', { date: state.date, amount_ml: Number(el.dataset.ml), label: el.dataset.label }, `+ ${el.dataset.label}`))) el.disabled = false;
      break;
    case 'water-other': waterOtherSheet(); break;
    case 'units-sheet': unitsSheet(); break;
    case 'del-water': await mutate(`/water/${el.dataset.id}`, 'DELETE', undefined, 'Removed'); break;
    case 'del-food': await mutate(`/food/${el.dataset.id}`, 'DELETE', undefined, 'Removed'); break;
    case 'same-book': await saveDay({ book_title: el.dataset.book }); break;
    case 'pages-step': {
      haptic();
      const cur = Number(state.day.day?.pages_read || 0);
      const next = Math.max(0, cur + Number(el.dataset.step));
      state.day.day = { ...(state.day.day || {}), pages_read: next };
      $('#pages').value = next;
      clearTimeout(window.__pagesT);
      window.__pagesT = setTimeout(() => saveDay({ pages_read: next }), 500);
      break;
    }
    case 'yn': {
      haptic();
      const field = el.dataset.field;
      const v = Number(el.dataset.value);
      const cur = state.day.day?.[field];
      await saveDay({ [field]: cur === v ? null : v === 1 });
      break;
    }
    case 'view-photo': {
      const set = el.dataset.set === 'meal' ? state.day.meal_photos : state.day.progress_photos;
      openViewer(set, Number(el.dataset.i), {
        owner: canEdit(),
        label: () => `${el.dataset.set === 'meal' ? 'Meal' : 'Progress'} · ${fmtDate(state.date)}`,
      });
      break;
    }
    case 'gallery-open':
      openViewer(state.photoList, Number(el.dataset.i), { owner: state.view === state.me, label: state.photoLabel });
      break;
    case 'viewer-step': stepViewer(Number(el.dataset.step)); break;
    case 'close-viewer': closeViewer(); break;
    case 'del-photo': {
      if (!confirm('Delete this photo?')) break;
      const ok = await run(() => api(`/photos/${el.dataset.id}`, { method: 'DELETE' }), 'Photo deleted');
      if (!ok) break;
      closeViewer();
      const page = parseHash().parts[0] || 'day';
      if (page === 'photos') renderPhotos();
      else { await loadDay(); paintDay(); }
      break;
    }
    case 'close-sheet': closeSheet(); break;
    case 'hevy-connect': hevySheet(); break;
    case 'disconnect':
      if (confirm(`Disconnect ${SRC_NAME[el.dataset.p]}?`)) {
        await run(() => api(`/connections/${el.dataset.p}`, { method: 'DELETE' }), 'Disconnected');
        renderSettings();
      }
      break;
    case 'logout':
      await run(() => api('/logout', { method: 'POST' }));
      state.me = null;
      renderLogin();
      break;
  }
});

document.addEventListener('change', async (e) => {
  const el = e.target;
  if (el.dataset.action === 'pick-date' && el.value) {
    const v = el.value > todayStr() ? todayStr() : el.value;
    location.hash = dayHash(v);
    return;
  }
  if (el.id === 'notes') return; // handled by the notes autosave
  if (el.dataset.field && canEdit()) {
    const v = el.type === 'number' ? (el.value === '' ? null : Number(el.value)) : el.value.trim();
    if ((state.day.day?.[el.dataset.field] ?? (el.type === 'number' ? null : '')) === v) return;
    await saveDay({ [el.dataset.field]: v });
    return;
  }
  if (el.dataset.setting) {
    const body = { [el.dataset.setting]: el.value, timezone: tz };
    await run(() => api('/settings', { method: 'PUT', body }), 'Saved');
    state.day = null; // day numbers may have changed
    return;
  }
  if (el.dataset.upload) {
    const kind = el.dataset.upload;
    const files = el.files;
    if (!files?.length) return;
    const ok = await run(async () => { await uploadPhotos(files, kind, state.date); return true; }, kind === 'progress' ? 'Progress photo saved' : 'Meal photo saved');
    if (ok) { await loadDay(); paintDay(); }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.dataset?.field && e.target.tagName === 'INPUT') e.target.blur();
  if (e.key === 'Escape') { closeViewer(); closeSheet(); }
});

document.addEventListener('submit', async (e) => {
  const form = e.target;
  if (form.dataset.form !== 'food') return;
  e.preventDefault();
  const d = await mutate('/food', 'POST', { date: state.date, name: form.wname.value.trim(), calories: Number(form.calories.value) }, 'Added');
  if (d) $('form[data-form="food"] input[name="wname"]')?.focus();
});

// Refresh when coming back to the app (e.g. the other person logged something)
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !state.me) return;
  const page = parseHash().parts[0] || 'day';
  if (page === 'day' && !$('.sheet') && !$('.viewer') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    try { await loadDay(); paintDay(); } catch {}
  }
});

// ---------- Boot ----------
async function boot() {
  try {
    const me = await api('/me');
    Object.assign(state, { me: me.me, users: me.users, rules: me.rules, providers: me.providers });
  } catch {
    return renderLogin();
  }
  if (!state.view || !userCfg(state.view).id) setView(state.me);
  else setView(state.view);
  state.units = (await run(() => api('/water-units'))) || [];
  api('/settings', { method: 'PUT', body: { timezone: tz } }).catch(() => {});
  if (!location.hash || location.hash === '#/' || location.hash === '#') location.hash = dayHash(todayStr());
  else route();
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
boot();
