import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ data: null, error: { message: 'Not authenticated' } });
  }
  const { user } = session;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (error) {
      return res.status(500).json({ data: null, error: { message: error.message, code: error.code } });
    }
    return res.status(200).json({ data, error: null });
  }

  if (req.method === 'PUT') {
    const { email_notifications, profile_public } = req.body;
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        email_notifications,
        profile_public,
      })
      .select()
      .single();
    if (error) {
      return res.status(500).json({ data: null, error: { message: error.message, code: error.code } });
    }
    return res.status(200).json({ data, error: null });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 