CREATE TABLE list_cache (
  key TEXT PRIMARY KEY,
  response JSONB,
  last_refreshed_at TIMESTAMPTZ
);