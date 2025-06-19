import { TitleDetails } from '@/pages/title/[id]';

export const parseTitleDetails = (details: Partial<TitleDetails>): TitleDetails => {
  return {
    ...details,
    id: details.id || '0',
    title: details.title || 'Unknown Title',
    poster_path: details.poster_path || null,
    media_type: details.media_type || 'movie',
    overview: details.overview || null,
    runtime: details.runtime || null,
    release_date: details.release_date || '',
    status: details.status || '',
    vote_average: details.vote_average || 0,
    vote_count: details.vote_count || 0,
    imdb_id: details.imdb_id || null,
    images: details.images || { poster_path: null, backdrop_path: null },
    backdrop_path: details.backdrop_path || null,
    genres: Array.isArray(details.genres) ? details.genres : [],
    videos: Array.isArray(details.videos) ? details.videos : [],
    credits: details.credits || { cast: [], crew: [] },
    stream_sources: Array.isArray(details.stream_sources) ? details.stream_sources : [],
    similar: Array.isArray(details.similar) ? details.similar : [],
    seasons: Array.isArray(details.seasons) ? details.seasons : [],
  };
};
