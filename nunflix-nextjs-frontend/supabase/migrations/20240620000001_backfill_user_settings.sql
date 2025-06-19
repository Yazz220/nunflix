-- Backfill user_settings for all existing users
INSERT INTO user_settings (user_id, email_notifications, profile_public)
SELECT id, TRUE, TRUE FROM auth.users
ON CONFLICT (user_id) DO NOTHING; 