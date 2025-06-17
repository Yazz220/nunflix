CREATE TABLE progress (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_id BIGINT NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  season_number INT,
  episode_number INT,
  position INT NOT NULL,
  duration INT NOT NULL,
  media_type TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, title_id, season_number, episode_number)
);

-- Index for efficient progress lookups
CREATE INDEX idx_progress_user_title ON progress(user_id, title_id);