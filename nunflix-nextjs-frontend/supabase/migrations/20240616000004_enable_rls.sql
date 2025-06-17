-- Enable RLS for user-specific tables
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Policies for 'favorites' table
CREATE POLICY "Users can view their own favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
ON favorites FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- Policies for 'watchlist' table
CREATE POLICY "Users can view their own watchlist"
ON watchlist FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own watchlist"
ON watchlist FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist"
ON watchlist FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist"
ON watchlist FOR DELETE
USING (auth.uid() = user_id);

-- Policies for 'progress' table
CREATE POLICY "Users can view their own progress"
ON progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own progress"
ON progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON progress FOR DELETE
USING (auth.uid() = user_id);