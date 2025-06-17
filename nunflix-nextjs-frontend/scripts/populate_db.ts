import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const tmdbApiKey = process.env.TMDB_API_KEY; // New: TMDB API Key

interface TmdbWatchProvider {
  provider_name: string;
  logo_path: string;
}

interface ProcessedWatchProvider {
  label: string;
  embed_url: string;
  provider_name?: string;
  logo_path?: string;
}

if (!supabaseUrl || !supabaseKey || !tmdbApiKey) {
  throw new Error('Supabase URL, service key, and TMDB API key are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTmdbDetails(id: string, mediaType: 'movie' | 'tv') {
  try {
    const url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${tmdbApiKey}&append_to_response=credits,videos,similar,images,watch/providers`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching TMDB details for ${mediaType} ID ${id}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();

    // Process watch providers if available
    let watchProviders: ProcessedWatchProvider[] = []; // Explicitly type watchProviders
    if (data['watch/providers'] && data['watch/providers'].results && data['watch/providers'].results.US) {
      const usProviders = data['watch/providers'].results.US;
      if (usProviders.flatrate) {
        watchProviders = [...watchProviders, ...usProviders.flatrate.map((p: TmdbWatchProvider) => ({ provider_name: p.provider_name, logo_path: p.logo_path, label: p.provider_name, embed_url: '' }))];
      }
      if (usProviders.rent) {
        watchProviders = [...watchProviders, ...usProviders.rent.map((p: TmdbWatchProvider) => ({ provider_name: p.provider_name, logo_path: p.logo_path, label: p.provider_name, embed_url: '' }))];
      }
      if (usProviders.buy) {
        watchProviders = [...watchProviders, ...usProviders.buy.map((p: TmdbWatchProvider) => ({ provider_name: p.provider_name, logo_path: p.logo_path, label: p.provider_name, embed_url: '' }))];
      }
    }

    return {
      credits: data.credits || { cast: [], crew: [] },
      videos: data.videos?.results.filter((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || [],
      similar: (data.similar?.results || []).map((s: any) => ({
        id: s.id,
        title: s.title || s.name,
        poster_path: s.poster_path,
        media_type: s.media_type,
      })),
      images: {
        poster_path: data.poster_path || null,
        backdrop_path: data.backdrop_path || null,
      },
      runtime: data.runtime || data.episode_run_time?.[0] || null,
      genres: data.genres || [],
      // Ensure seasons data is correctly fetched and structured for TV shows
      seasons: data.seasons || [],
      imdb_id: data.imdb_id || null,
      status: data.status || null,
      number_of_seasons: data.number_of_seasons || null,
      number_of_episodes: data.number_of_episodes || null,
      watch_providers: watchProviders, // Use the processed watch providers
      episode_run_time: Array.isArray(data.episode_run_time) ? data.episode_run_time : [], // Ensure this is always an array
    };
  } catch (error) {
    console.error(`Failed to fetch TMDB details for ${mediaType} ID ${id}:`, error);
    return null;
  }
}

async function fetchEpisodesForSeason(titleId: number, seasonNumber: number) {
  try {
    const url = `${TMDB_BASE_URL}/tv/${titleId}/season/${seasonNumber}?api_key=${tmdbApiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching episodes for season ${seasonNumber} of title ${titleId}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data.episodes.map((episode: any) => ({
      title_id: titleId,
      season_number: seasonNumber,
      episode_number: episode.episode_number,
      name: episode.name,
      overview: episode.overview,
      air_date: episode.air_date,
      still_path: episode.still_path,
      vote_average: episode.vote_average,
      runtime: episode.runtime,
    }));
  } catch (error) {
    console.error(`Failed to fetch episodes for season ${seasonNumber} of title ${titleId}:`, error);
    return null;
  }
}

async function populateDatabase() {
  try {
    // 1. Populate Titles
    console.log('Populating titles...');
    const { data: titles, error } = await supabase.from('titles').select('id,title,media_type');

    if (error) {
      console.error('Error fetching titles:', error);
      return;
    }

    for (const title of titles) {
      console.log(`Fetching TMDB details for ${title.title} (${title.media_type} ID: ${title.id})...`);
      const tmdbDetails = await fetchTmdbDetails(title.id, title.media_type);

      if (tmdbDetails) {
        const { error: updateError } = await supabase
          .from('titles')
          .update({
            genres: tmdbDetails.genres,
            runtime: tmdbDetails.runtime,
            episode_run_time: tmdbDetails.episode_run_time,
            status: tmdbDetails.status,
            videos: tmdbDetails.videos,
            credits: tmdbDetails.credits,
            images: tmdbDetails.images,
            stream_sources: tmdbDetails.watch_providers,
            similar: tmdbDetails.similar,
            number_of_seasons: tmdbDetails.number_of_seasons,
            number_of_episodes: tmdbDetails.number_of_episodes,
            seasons: tmdbDetails.seasons,
            imdb_id: tmdbDetails.imdb_id,
          })
          .eq('id', title.id);

        if (updateError) {
          console.error(`Error updating title ${title.id}:`, updateError);
        }

        if (title.media_type === 'tv' && tmdbDetails.seasons) {
          for (const season of tmdbDetails.seasons) {
            const episodes = await fetchEpisodesForSeason(title.id, season.season_number);
            if (episodes) {
              const { error: episodesError } = await supabase.from('episodes').upsert(episodes, { onConflict: 'title_id, season_number, episode_number' });
              if (episodesError) {
                console.error(`Error populating episodes for title ${title.id}, season ${season.season_number}:`, episodesError);
              }
            }
          }
        }

      } else {
        console.warn(`Skipping ${title.title} due to missing TMDB details.`);
      }

      // Add a small delay to avoid hitting TMDB rate limits
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }
    console.log('Titles populated successfully.');
    console.log('Episodes populated successfully.');

  } catch (error) {
    console.error('An error occurred during database population:', error);
  }
}

populateDatabase();