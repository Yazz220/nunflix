import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q, page = '1' } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const limit = 20;
  const offset = (pageNumber - 1) * limit;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query' });
  }

  try {
    const { data, count } = await supabase
      .from('titles')
      .select('*', { count: 'exact' })
      .textSearch('title', q, {
        type: 'websearch',
        config: 'english',
      })
      .range(offset, offset + limit - 1);

    res.status(200).json({
      results: data,
      page: pageNumber,
      total_pages: count ? Math.ceil(count / limit) : 1,
      total_results: count,
    });
  } catch {
    res.status(500).json({ error: `Failed to fetch search results for query: ${q}` });
  }
}
