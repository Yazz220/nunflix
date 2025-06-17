import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "sentry";
import { DOMParser, Element } from "dom";

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
    name: 'vidsrc.to',
    url: 'https://vidsrc.to/movies',
    selector: 'a.movie-card',
    attribute: 'href',
  },
  {
    name: 'multiembed.mov',
    url: 'https://multiembed.mov/',
    selector: 'a.movie-card',
    attribute: 'href',
  },
];

async function scrape() {
  for (const target of SCRAPE_TARGETS) {
    try {
      const response = await fetch(target.url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      if (!doc) {
        throw new Error("Failed to parse HTML");
      }
      const links = doc.querySelectorAll(target.selector);

      for (const link of Array.from(links)) {
        const embedUrl = (link as Element).getAttribute(target.attribute);
        if (embedUrl) {
          const normalizedUrl = new URL(embedUrl, target.url).toString();
          const { error } = await supabase.from('embed_providers').upsert({
            name: target.name,
            url: normalizedUrl,
            is_active: true,
          }, { onConflict: 'url' });
          if (error) {
            Sentry.captureException(error);
          }
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}

serve(async (_req) => {
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
