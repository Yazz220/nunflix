import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { user } = session;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, raw_user_meta_data')
      .eq('id', user.id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const profile = {
      id: data.id,
      email: data.email,
      avatar_url: data.raw_user_meta_data?.avatar_url,
      display_name: data.raw_user_meta_data?.display_name,
      bio: data.raw_user_meta_data?.bio,
    };

    return res.status(200).json(profile);
  }

  if (req.method === 'PUT') {
    const { avatar_url, display_name, bio } = req.body;

    const { data, error } = await supabase.auth.updateUser({
      data: { avatar_url, display_name, bio },
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const updatedProfile = {
      id: data.user.id,
      email: data.user.email,
      avatar_url: data.user.user_metadata.avatar_url,
      display_name: data.user.user_metadata.display_name,
      bio: data.user.user_metadata.bio,
    };

    return res.status(200).json(updatedProfile);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}