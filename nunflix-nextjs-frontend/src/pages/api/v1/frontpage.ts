import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data: titles, error } = await supabase.from('titles').select('*');

    if (error) {
      throw error;
    }

    const trending = titles.sort(() => 0.5 - Math.random()).slice(0, 10);
    const popular_movies = titles.filter(t => t.media_type === 'movie').sort(() => 0.5 - Math.random()).slice(0, 10);
    const popular_tv = titles.filter(t => t.media_type === 'tv').sort(() => 0.5 - Math.random()).slice(0, 10);
    const top_rated = titles.sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);

    res.status(200).json({
      trending,
      popular_movies,
      popular_tv,
      top_rated,
      titles,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch front page data' });
  }
}