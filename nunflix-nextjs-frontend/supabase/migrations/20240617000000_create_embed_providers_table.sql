CREATE TABLE embed_providers (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  base_url       TEXT NOT NULL UNIQUE,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  last_checked_at TIMESTAMPTZ
);

INSERT INTO embed_providers (base_url) 
VALUES ('https://vidsrc.to/embed'),
       ('https://multiembed.mov/?video_id')
ON CONFLICT DO NOTHING;

ALTER TABLE embed_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON embed_providers FOR SELECT USING (true);