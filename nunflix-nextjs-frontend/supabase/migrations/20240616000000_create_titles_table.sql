CREATE TABLE titles (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  overview TEXT,
  release_date DATE,
  vote_average REAL,
  vote_count INT,
  imdb_id TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  media_type TEXT NOT NULL,
  genres JSONB,
  runtime INT,
  episode_run_time INT[],
  status TEXT,
  videos JSONB,
  credits JSONB,
  images JSONB,
  stream_sources JSONB,
  "similar" JSONB,
  number_of_seasons INT,
  number_of_episodes INT,
  seasons JSONB,
  watch_providers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);