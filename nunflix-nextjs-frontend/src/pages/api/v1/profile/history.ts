import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ results: [], count: 0, error: { message: 'Not authenticated' } });
  }
  const { user } = session;

  if (req.method === 'GET') {
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const page = parseInt((req.query.page as string) || '1', 10);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('progress')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ results: [], count: 0, error: { message: error.message, code: error.code } });
    }
    return res.status(200).json({ results: data || [], count: count || 0, error: null });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 