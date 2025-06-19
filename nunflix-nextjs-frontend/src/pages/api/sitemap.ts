import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

const SITEMAP_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const SITEMAP_FOOTER = `</urlset>`;

const createSitemapUrl = (loc: string, lastmod: string) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1️⃣  Static navigation routes to add to the sitemap.
  //    These mirror the nav-bars & burger menu so that search-engines
  //    discover every user-accessible category page.
  const staticPaths: string[] = [
    '/', // Home
    // --- Movies ---
    '/movies',
    '/movies/trending',
    '/movies/popular',
    '/movies/top_rated',
    '/movies/marvel',
    '/movies/dc',
    '/movies/paramount',
    '/movies/disney',
    '/movies/most_viewed',
    // --- Shows ---
    '/tv',
    '/shows/popular',
    '/shows/top_rated',
    '/shows/netflix',
    '/shows/hbo',
    '/shows/apple_tv+',
    '/shows/prime_video',
    '/shows/shahid_vip',
    '/shows/starz_play',
    '/shows/hulu',
    // --- Streaming Providers ---
    '/streaming/netflix',
    '/streaming/disney+',
    '/streaming/hbo_max',
    '/streaming/apple_tv+',
    '/streaming/prime_video',
    '/streaming/shahid_vip',
    '/streaming/starz_play',
    '/streaming/hulu',
    // --- Discover ---
    '/discover', // Trending Today default
    '/discover?genre=anime',
    '/discover?sort=vote_average.desc',
    '/discover?sort=popularity.desc',
    '/discover?collection=marvel',
    '/discover?collection=dc',
    '/discover?sort=views.desc',
  ];

  // Generate XML blocks for static pages (use current date for <lastmod>)
  const todayIso = new Date().toISOString();
  const staticUrlsXml = staticPaths
    .map((p) => createSitemapUrl(`https://www.nunflix.com${p}`, todayIso))
    .join('');

  const { data: titles } = await supabase.from('titles').select('id, media_type, updated_at');

  const sitemap = `
    ${SITEMAP_HEADER}
    ${staticUrlsXml}
    ${titles?.map(title => createSitemapUrl(`https://www.nunflix.com/title/${title.id}?type=${title.media_type}`, title.updated_at)).join('')}
    ${SITEMAP_FOOTER}
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}