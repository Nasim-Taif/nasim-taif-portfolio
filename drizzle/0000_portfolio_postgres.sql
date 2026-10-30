CREATE TABLE IF NOT EXISTS portfolio_content (
  id TEXT PRIMARY KEY,
  published TEXT NOT NULL,
  draft TEXT,
  revision INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_owner (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL
);
