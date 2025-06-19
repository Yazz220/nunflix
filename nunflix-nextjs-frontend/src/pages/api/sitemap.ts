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
  const { data: titles } = await supabase.from('titles').select('id, media_type, updated_at');

  const sitemap = `
    ${SITEMAP_HEADER}
    ${titles?.map(title => createSitemapUrl(`https://www.nunflix.com/title/${title.id}?type=${title.media_type}`, title.updated_at)).join('')}
    ${SITEMAP_FOOTER}
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}