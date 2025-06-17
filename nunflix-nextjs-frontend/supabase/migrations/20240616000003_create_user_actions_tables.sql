CREATE TABLE favorites (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_id BIGINT NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, title_id)
);

CREATE TABLE watchlist (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_id BIGINT NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, title_id)
);

-- Indexes for performance
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);