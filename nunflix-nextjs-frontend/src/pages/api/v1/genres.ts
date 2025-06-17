import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import * as Sentry from '@sentry/nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { media_type } = req.query;

  if (!media_type || (media_type !== 'movie' && media_type !== 'tv')) {
    return res.status(400).json({ error: 'Invalid media_type' });
  }

  const cacheKey = `genres:${media_type}`;

  try {
    // 1. Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('list_cache')
      .select('response, last_refreshed_at')
      .eq('key', cacheKey)
      .single();

    if (cachedData && !cacheError) {
      const lastRefreshed = new Date(cachedData.last_refreshed_at);
      // Genres change very rarely, so we can use a long cache duration (24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (lastRefreshed > twentyFourHoursAgo) {
        return res.status(200).json(cachedData.response);
      }
    }
    
    if (cacheError && cacheError.code !== 'PGRST116') { // Ignore 'single row not found' errors
        console.warn(`Error reading from cache for key [${cacheKey}]:`, cacheError);
        // Do not throw; proceed to fetch from TMDB
    }

    // 2. Fetch from TMDB if cache is stale or missing
    const tmdbUrl = new URL(`https://api.themoviedb.org/3/genre/${media_type}/list`);
    tmdbUrl.searchParams.append('api_key', process.env.TMDB_API_KEY || '');
    
    const tmdbRes = await fetch(tmdbUrl.toString());
    if (!tmdbRes.ok) {
      const errorBody = await tmdbRes.text();
      Sentry.captureMessage(`TMDB genre fetch failed with status ${tmdbRes.status}: ${errorBody}`);
      throw new Error(`Failed to fetch genres from TMDB. Status: ${tmdbRes.status}`);
    }
    const tmdbData = await tmdbRes.json();

    // 3. Store in cache
    const { error: upsertError } = await supabase.from('list_cache').upsert({
      key: cacheKey,
      response: tmdbData,
      last_refreshed_at: new Date().toISOString(),
    });

    if (upsertError) {
        Sentry.captureException(upsertError);
        console.error('Failed to upsert genre data into cache:', upsertError);
    }

    // 4. Return response
    res.status(200).json(tmdbData);

  } catch (error) {
    Sentry.captureException(error);
    // If cache read fails, return an empty list as a fallback
    if (error instanceof Error && error.message.includes('cache')) {
        return res.status(200).json({ genres: [] });
    }
    res.status(502).json({ error: 'Failed to fetch genre data' });
  }
}