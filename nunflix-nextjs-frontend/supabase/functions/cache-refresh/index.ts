import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as Sentry from "https://deno.land/x/sentry/index.mjs";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const tmdbApiKey = Deno.env.get('TMDB_API_KEY');
const sentryDsn = Deno.env.get('SENTRY_DSN');

if (!supabaseUrl || !supabaseKey || !tmdbApiKey) {
  throw new Error('Supabase URL, service key, and TMDB API key are required.');
}

if (sentryDsn) {
  Sentry.init({ dsn: sentryDsn });
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchWithBackoff(url: string, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

async function fetchTmdbDetails(id: string, mediaType: 'movie' | 'tv') {
  const url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${tmdbApiKey}&append_to_response=credits,videos,similar,images,watch/providers`;
  return fetchWithBackoff(url);
}

async function fetchEpisodesForSeason(titleId: number, seasonNumber: number) {
  const url = `${TMDB_BASE_URL}/tv/${titleId}/season/${seasonNumber}?api_key=${tmdbApiKey}`;
  return fetchWithBackoff(url);
}

async function populateDatabase() {
  const { data: titles, error } = await supabase.from('titles').select('id,title,media_type');

  if (error) {
    Sentry.captureException(error);
    throw error;
  }

  for (const title of titles) {
    try {
      const tmdbDetails = await fetchTmdbDetails(title.id, title.media_type);

      if (tmdbDetails) {
        const { error: updateError } = await supabase
          .from('titles')
          .update({
            ...tmdbDetails,
            last_refreshed_at: new Date().toISOString(),
          })
          .eq('id', title.id);

        if (updateError) {
          Sentry.captureException(updateError);
        }

        if (title.media_type === 'tv' && tmdbDetails.seasons) {
          for (const season of tmdbDetails.seasons) {
            const episodes = await fetchEpisodesForSeason(title.id, season.season_number);
            if (episodes) {
              const { error: episodesError } = await supabase.from('episodes').upsert(episodes, { onConflict: 'title_id, season_number, episode_number' });
              if (episodesError) {
                Sentry.captureException(episodesError);
              }
            }
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
    await populateDatabase();
    return new Response(
      JSON.stringify({ message: 'Cache refreshed successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ error: 'Failed to refresh cache' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
