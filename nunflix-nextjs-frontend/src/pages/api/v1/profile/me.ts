import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/pages/api/utils/withAuth';
import { supabase } from '@/lib/supabaseClient';

async function handler(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, avatar_url, display_name, bio')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { avatar_url, display_name, bio } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, avatar_url, display_name, bio })
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withAuth(handler);
