import type { NextApiRequest, NextApiResponse } from 'next';

const STREAMING_PROVIDERS = [
  {
    name: 'Vidsrc.to',
    buildUrl: (tmdbId: string, type: string) => `https://vidsrc.to/embed/${type}/${tmdbId}`,
  },
  {
    name: 'Multiembed.mov',
    buildUrl: (tmdbId: string, type: string) => `https://multiembed.mov/?video_id=${tmdbId}`,
  },
  // Add more providers here
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, type } = req.query;

  if (!id || !type || typeof id !== 'string' || typeof type !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid id or type' });
  }

  const streamSources = [];

  for (const provider of STREAMING_PROVIDERS) {
    const url = provider.buildUrl(id, type);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        streamSources.push({
          name: provider.name,
          url: url,
        });
      }
    } catch (error) {
      console.error(`Error checking provider ${provider.name}:`, error);
    }
  }

  if (streamSources.length === 0) {
    return res.status(404).json({ error: 'No working stream sources found' });
  }

  res.status(200).json({ stream_sources: streamSources });
}