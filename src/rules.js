// Challenge rules + per-person configuration.

export const USERS = {
  dylan: { id: 'dylan', name: 'Dylan', diet: 'nosugar' },
  neil: { id: 'neil', name: 'Neil', diet: 'calories' },
};

export const GOAL_WATER_ML = 3785.41; // 1 US gallon
export const BLOCK_MIN_SEC = 45 * 60;
export const MIN_PAGES = 10;
export const CHALLENGE_DAYS = 75;

// "YYYY-MM-DDTHH:MM" wall-clock string -> minutes since epoch (treated as UTC, only used for differences)
export function localToMin(s) {
  return Date.parse(s.length === 16 ? s + ':00Z' : s + 'Z') / 60000;
}

export function summarizeBlock(workouts, outdoor) {
  if (!workouts.length) return { total_sec: 0, count: 0, done: false, outdoor: !!outdoor, start: null, end: null };
  let start = Infinity;
  let end = -Infinity;
  let total = 0;
  for (const w of workouts) {
    const s = localToMin(w.start_local);
    start = Math.min(start, s);
    end = Math.max(end, s + w.duration_sec / 60);
    total += w.duration_sec;
  }
  return { total_sec: total, count: workouts.length, done: total >= BLOCK_MIN_SEC, outdoor: !!outdoor, start, end };
}

export function computeStatus(user, day, workouts, waterMl, progressPhotos) {
  day = day || {};
  const b1 = summarizeBlock(workouts.filter((w) => w.block === 1), day.block1_outdoor);
  const b2 = summarizeBlock(workouts.filter((w) => w.block === 2), day.block2_outdoor);

  const outdoorOk = (b1.outdoor && b1.count > 0) || (b2.outdoor && b2.count > 0);
  const workoutsOk = b1.done && b2.done && outdoorOk;

  const waterPct = Math.round((waterMl / GOAL_WATER_ML) * 100);
  const waterOk = waterMl >= GOAL_WATER_ML - 1;

  const readingOk = !!(day.book_title && day.book_title.trim()) && (day.pages_read || 0) >= MIN_PAGES;

  let dietOk = day.diet_held === 1;
  if (USERS[user].diet === 'nosugar') dietOk = dietOk && day.sugar_eaten === 0;

  const photoOk = progressPhotos > 0;

  const parts = { workouts: workoutsOk, water: waterOk, reading: readingOk, diet: dietOk, photo: photoOk };
  const doneCount = Object.values(parts).filter(Boolean).length;

  const strip = (b) => ({ total_sec: b.total_sec, count: b.count, done: b.done, outdoor: b.outdoor });
  return {
    parts,
    done_count: doneCount,
    complete: doneCount === 5,
    touched: doneCount > 0 || workouts.length > 0 || waterMl > 0,
    blocks: { 1: strip(b1), 2: strip(b2) },
    outdoor_ok: outdoorOk,
    water_pct: waterPct,
    water_ml: waterMl,
  };
}
