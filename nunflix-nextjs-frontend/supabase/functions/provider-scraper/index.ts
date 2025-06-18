import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as Sentry from "https://deno.land/x/sentry@7.86.0/index.mjs";
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const sentryDsn = Deno.env.get('SENTRY_DSN');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and service key are required.');
}

if (sentryDsn) {
  Sentry.init({ dsn: sentryDsn });
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SCRAPE_TARGETS = [
  {
    name: 'Streamtape',
    listUrl: (tmdbId: string) => `https://streamtape.com/v/${tmdbId}`,
    selector: 'iframe[src*="streamtape.com/e/"]',
    extract: (src: string): string | null => {
      const match = /\/e\/([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
  {
    name: 'Filemoon',
    listUrl: (tmdbId: string) => `https://filemoonapi.com/v/${tmdbId}`,
    selector: 'iframe[src*="/e/"]',
    extract: (src: string): string | null => {
      const match = /\/e\/([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
  {
    name: 'Uptostream',
    listUrl: (tmdbId: string) => `https://uptostream.com/v/${tmdbId}`,
    selector: 'iframe[src*="uptostream.com/e/"]',
    extract: (src: string): string | null => {
      const match = /\/e\/([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
  {
    name: 'Vidcloud',
    listUrl: (tmdbId: string) => `https://vidcloud9.com/v/${tmdbId}`,
    selector: 'iframe[src*="vidcloud9.com/e/"]',
    extract: (src: string): string | null => {
      const match = /\/e\/([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
  {
    name: 'Mp4upload',
    listUrl: (tmdbId: string) => `https://www.mp4upload.com/v/${tmdbId}`,
    selector: 'iframe[src*="mp4upload.com/embed-"]',
    extract: (src: string): string | null => {
      const match = /embed-([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
  {
    name: 'StreamSB',
    listUrl: (tmdbId: string) => `https://sbplay2.com/v/${tmdbId}`,
    selector: 'iframe[src*="sbplay2.com/e/"]',
    extract: (src: string): string | null => {
      const match = /\/e\/([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
  {
    name: 'RapidVideo',
    listUrl: (tmdbId: string) => `https://www.rapidvideo.com/v/${tmdbId}`,
    selector: 'iframe[src*="rapidvideo.com/e/"]',
    extract: (src: string): string | null => {
      const match = /\/e\/([^?&]+)/.exec(src);
      return match ? match[1] : null;
    },
  },
];

async function getScrapedFileId(providerName: string, tmdbId: string): Promise<string | null> {
  const target = SCRAPE_TARGETS.find(t => t.name === providerName);
  if (!target) {
    return null;
  }

  try {
    const response = await fetch(target.listUrl(tmdbId), {
      headers: {
        'User-Agent': 'Nunflix/1.0; +https://nunflix.app/bot.html',
      },
    });
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) {
      return null;
    }
    const link = doc.querySelector(target.selector);
    if (link) {
      const src = (link as Element).getAttribute('src');
      if (src) {
        return target.extract(src);
      }
    }
  } catch (error) {
    console.error(`Failed to scrape ${providerName} for tmdbId ${tmdbId}`, error);
    Sentry.captureException(error);
  }

  return null;
}

// TODO: Implement full scraping logic
async function scrape() {
  console.log("Scraping logic not yet implemented.");
}

serve(async (_req: Request) => {
  const enableScraper = Deno.env.get('ENABLE_PROVIDER_SCRAPER') === 'true';

  if (!enableScraper) {
    return new Response(
      JSON.stringify({ message: 'Provider scraper is disabled.' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    await scrape();
    return new Response(
      JSON.stringify({ message: 'Scraping complete' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ error: 'Failed to scrape' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});