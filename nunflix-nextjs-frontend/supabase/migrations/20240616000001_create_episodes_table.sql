CREATE TABLE episodes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title_id BIGINT NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  season_number INT NOT NULL,
  episode_number INT NOT NULL,
  name TEXT,
  overview TEXT,
  air_date DATE,
  still_path TEXT,
  vote_average REAL,
  runtime INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(title_id, season_number, episode_number)
);

-- Indexes to improve query performance
CREATE INDEX idx_episodes_title_id_season_number ON episodes(title_id, season_number);
