import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

import * as Sentry from '@sentry/nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { media_type, genre_id, sort_by, year, page = '1' } = req.query;

  if (!media_type || (media_type !== 'movie' && media_type !== 'tv')) {
    return res.status(400).json({ error: 'Invalid media_type' });
  }

  const cacheKey = `discover:${media_type}:genre=${genre_id}:sort=${sort_by}:year=${year}:page=${page}`;

  try {
    const { data: cachedData, error: cacheError } = await supabase
      .from('list_cache')
      .select('response, last_refreshed_at')
      .eq('key', cacheKey)
      .single();

    if (cachedData && !cacheError) {
      const lastRefreshed = new Date(cachedData.last_refreshed_at);
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      if (lastRefreshed > sixHoursAgo) {
        return res.status(200).json(cachedData.response);
      }
    }

    const tmdbUrl = new URL(`https://api.themoviedb.org/3/discover/${media_type}`);
    tmdbUrl.searchParams.append('api_key', process.env.TMDB_API_KEY || '');
    if (genre_id) tmdbUrl.searchParams.append('with_genres', genre_id as string);
    if (sort_by) tmdbUrl.searchParams.append('sort_by', sort_by as string);
    if (year) tmdbUrl.searchParams.append('primary_release_year', year as string);
    if (page) tmdbUrl.searchParams.append('page', page as string);

    const tmdbRes = await fetch(tmdbUrl.toString());
    if (!tmdbRes.ok) {
      throw new Error('Failed to fetch from TMDB');
    }
    const tmdbData = await tmdbRes.json();

    await supabase.from('list_cache').upsert({
      key: cacheKey,
      response: tmdbData,
      last_refreshed_at: new Date().toISOString(),
    });

    res.status(200).json(tmdbData);
  } catch (error) {
    Sentry.captureException(error);
    res.status(502).json({ error: 'Failed to fetch discover data' });
  }
}