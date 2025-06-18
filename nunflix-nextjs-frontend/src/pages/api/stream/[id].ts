import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import * as Sentry from '@sentry/nextjs';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, type } = req.query;

  if (!id || !type || typeof id !== 'string' || (type !== 'movie' && type !== 'tv')) {
    return res.status(400).json({ error: 'Missing or invalid id or type' });
  }

  try {
    const { data: providers, error } = await supabase
      .from('embed_providers')
      .select('base_url, pattern, type')
      .eq('is_active', true)
      .eq('type', 'tmdb');

    if (error) {
      Sentry.captureException(error);
      throw new Error('Failed to fetch providers from database');
    }

    if (!providers || providers.length === 0) {
      return res.status(500).json({ error: 'No active providers found' });
    }

    const shuffledProviders = shuffleArray(providers);
    const streamSources = [];

    for (const provider of shuffledProviders) {
      const embedUrl = provider.pattern
        .replace('{type}', type)
        .replace('{id}', id);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

        const response = await fetch(embedUrl, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          streamSources.push({
            name: new URL(provider.base_url).hostname, // Use hostname as name
            url: embedUrl,
          });
          // Return the first N working mirrors
          if (streamSources.length >= 2) {
            break;
          }
        }
      } catch (error) {
        // Ignore fetch errors (like timeouts) and continue
        console.warn(`Provider ${provider.base_url} failed:`, error);
      }
    }

    if (streamSources.length === 0) {
      return res.status(404).json({ error: 'No working stream sources found' });
    }

    res.status(200).json({ stream_sources: streamSources });

  } catch (error) {
    Sentry.captureException(error);
    res.status(502).json({ error: 'Failed to resolve stream sources' });
  }
}