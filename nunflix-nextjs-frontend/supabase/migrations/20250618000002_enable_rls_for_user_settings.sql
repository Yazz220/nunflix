-- Enable RLS for user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for 'user_settings' table
CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);