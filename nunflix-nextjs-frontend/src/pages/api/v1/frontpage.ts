import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORY_MAP } from '@/lib/category-map';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const SECTIONS = [
  { key: 'trending', title: 'Trending Now', endpoint: '/trending/all/week' },
  { key: 'must_watch', title: 'Must Watch', params: { sort_by: 'popularity.desc' } },
  { key: 'apple_tv', title: 'Apple TV+', params: { with_watch_providers: '2', watch_region: 'US' } },
  { key: 'starz', title: 'Starz', params: { with_watch_providers: '431', watch_region: 'US' } },
  { key: 'dc', title: 'DC', params: { with_companies: '9993' } },
  { key: 'prime_video', title: 'Prime Video', params: { with_watch_providers: '9', watch_region: 'US' } },
  { key: 'hbo', title: 'HBO', params: { with_watch_providers: '1899', watch_region: 'US' } },
  { key: 'cartoon_network', title: 'Cartoon Network', params: { with_companies: '56' } },
  { key: 'showtime', title: 'Showtime', params: { with_watch_providers: '67', watch_region: 'US' } },
  { key: 'hulu', title: 'Hulu', params: { with_watch_providers: '15', watch_region: 'US' } },
  { key: 'disney', title: 'Walt Disney Pictures', params: { with_companies: '2' } },
  { key: 'nickelodeon', title: 'Nickelodeon', params: { with_companies: '13' } },
  { key: 'peacock', title: 'Peacock', params: { with_watch_providers: '386', watch_region: 'US' } },
  { key: 'crunchyroll', title: 'Crunchyroll', params: { with_watch_providers: '283', watch_region: 'US' } },
  { key: 'anime', title: 'Anime', params: { with_genres: '16' } },
];

const fetchFromTMDB = async (endpoint: string, params: any = {}) => {
  const queryString = new URLSearchParams({
    api_key: TMDB_API_KEY!,
    ...params,
  }).toString();
  const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryString}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch from TMDB: ${endpoint}`);
  }
  const data = await res.json();
  return data.results;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const frontpageData: { [key: string]: any } = {};

    for (const section of SECTIONS) {
      const cacheKey = `frontpage:${section.key}`;
      const { data: cachedData, error: cacheError } = await supabase
        .from('list_cache')
        .select('data')
        .eq('key', cacheKey)
        .single();

      if (cachedData && !cacheError) {
        frontpageData[section.key] = cachedData.data;
      } else {
        let data;
        if (section.endpoint) {
          data = await fetchFromTMDB(section.endpoint);
        } else {
          data = await fetchFromTMDB('/discover/movie', section.params);
        }
        frontpageData[section.key] = data;

        await supabase.from('list_cache').upsert({
          key: cacheKey,
          data: data,
        });
      }
    }

    res.status(200).json(frontpageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch front page data' });
  }
}
