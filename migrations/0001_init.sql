-- Per-user settings (users themselves are fixed in code: dylan, neil)
CREATE TABLE settings (
  user_id TEXT PRIMARY KEY,
  start_date TEXT,              -- YYYY-MM-DD, day 1 of the challenge
  calorie_goal INTEGER,         -- Neil only
  timezone TEXT
);

-- One row per person per day for the simple yes/no + text fields
CREATE TABLE days (
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  diet_held INTEGER,            -- NULL = unanswered, 0/1
  sugar_eaten INTEGER,          -- Dylan: NULL/0/1
  book_title TEXT,
  pages_read INTEGER,
  block1_outdoor INTEGER NOT NULL DEFAULT 0,
  block2_outdoor INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  updated_at TEXT,
  PRIMARY KEY (user_id, date)
);

CREATE TABLE workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  block INTEGER NOT NULL CHECK (block IN (1, 2)),
  source TEXT NOT NULL,         -- manual | strava | garmin | hevy
  external_id TEXT,
  name TEXT NOT NULL,
  activity_type TEXT,
  start_local TEXT NOT NULL,    -- YYYY-MM-DDTHH:MM (local wall-clock)
  duration_sec INTEGER NOT NULL,
  distance_m REAL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_workouts_user_date ON workouts (user_id, date);

CREATE TABLE water_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  amount_ml REAL NOT NULL,
  label TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_water_user_date ON water_entries (user_id, date);

CREATE TABLE water_units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  ml REAL NOT NULL
);

-- Neil's calorie counter
CREATE TABLE food_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  name TEXT,
  calories INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_food_user_date ON food_entries (user_id, date);

CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('progress', 'meal')),
  r2_key TEXT NOT NULL,
  caption TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_photos_user_date ON photos (user_id, date);
CREATE INDEX idx_photos_kind ON photos (user_id, kind, date);

-- OAuth tokens / API keys for Strava, Garmin, Hevy
CREATE TABLE connections (
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER,           -- epoch seconds
  api_key TEXT,
  external_user_id TEXT,
  connected_at TEXT NOT NULL,
  PRIMARY KEY (user_id, provider)
);

-- Activities pushed to us (Garmin) or fetched from providers
CREATE TABLE external_activities (
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT,
  activity_type TEXT,
  start_local TEXT NOT NULL,
  duration_sec INTEGER NOT NULL,
  distance_m REAL,
  outdoor_hint INTEGER,
  fetched_at TEXT NOT NULL,
  PRIMARY KEY (provider, external_id)
);
CREATE INDEX idx_ext_user_start ON external_activities (user_id, start_local);
