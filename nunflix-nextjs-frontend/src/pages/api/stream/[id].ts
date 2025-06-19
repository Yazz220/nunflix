import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import * as Sentry from '@sentry/nextjs';

interface Provider {
  base_url: string;
  pattern: string;
  type: string;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: Provider[]) => {
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

  const isValidId = (val: unknown): val is string => typeof val === 'string' && /^[a-zA-Z0-9_-]+$/.test(val);
  const isValidType = (val: unknown): val is 'movie' | 'tv' => val === 'movie' || val === 'tv';

  if (!isValidId(id) || !isValidType(type)) {
    return res.status(400).json({ error: 'Invalid id or type provided' });
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

    const promises = shuffledProviders.map(provider => {
      const embedUrl = provider.pattern
        .replace('{type}', type)
        .replace('{id}', id);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1-second timeout

      return fetch(embedUrl, { method: 'HEAD', signal: controller.signal })
        .then(response => {
          clearTimeout(timeoutId);
          if (response.ok) {
            return {
              name: new URL(provider.base_url).hostname,
              url: embedUrl,
            };
          }
          return null;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.warn(`Provider ${provider.base_url} failed:`, error);
          return null;
        });
    });

    const results = await Promise.all(promises);
    const streamSources = results.filter(Boolean).slice(0, 3);

    if (streamSources.length === 0) {
      return res.status(404).json({ error: 'No working stream sources found' });
    }

    res.status(200).json({ stream_sources: streamSources });

  } catch (error) {
    Sentry.captureException(error);
    res.status(502).json({ error: 'Failed to resolve stream sources' });
  }
}
