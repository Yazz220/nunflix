ALTER TABLE embed_providers ADD COLUMN pattern TEXT;
ALTER TABLE embed_providers ADD COLUMN type TEXT;

INSERT INTO embed_providers (base_url, pattern, type, is_active)
VALUES
  ('https://vidsrc.to/embed/', 'https://vidsrc.to/embed/{type}/{id}', 'tmdb', true),
  ('https://multiembed.mov/', 'https://multiembed.mov/?video_id={id}&tmdb=1', 'tmdb', true),
  ('https://streamtape.com/e/', 'https://streamtape.com/e/{fileId}', 'scrape', true),
  ('https://uptostream.com/stream/', 'https://uptostream.com/stream/{fileId}', 'scrape', true),
  ('https://filemoon.sx/e/', 'https://filemoon.sx/e/{fileId}', 'scrape', true),
  ('https://vidcloud9.com/embed/', 'https://vidcloud9.com/embed/{fileId}', 'scrape', true),
  ('https://www.mp4upload.com/embed-', 'https://www.mp4upload.com/embed-{fileId}.html', 'scrape', true),
  ('https://sbplay2.com/e/', 'https://sbplay2.com/e/{fileId}', 'scrape', true),
  ('https://www.rapidvideo.com/e/', 'https://www.rapidvideo.com/e/{fileId}', 'scrape', true);