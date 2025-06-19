import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid id' });
  }

  try {
    const { data } = await supabase
      .from('titles')
      .select('*, stream_sources, seasons, credits, videos, similar')
      .eq('id', Number(id))
      .single();

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: `Failed to fetch title details for id: ${id}` });
  }
}
