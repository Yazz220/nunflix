import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query' });
  }

  try {
    const { data, error } = await supabase
      .from('titles')
      .select('*')
      .textSearch('title', q, {
        type: 'websearch',
        config: 'english',
      });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch search results for query: ${q}` });
  }
}