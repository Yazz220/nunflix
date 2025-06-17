import { TitleDetails } from '@/pages/title/[id]';

export const parseTitleDetails = (details: any): TitleDetails => {
  return {
    ...details,
    genres: Array.isArray(details.genres) ? details.genres : [],
    videos: Array.isArray(details.videos) ? details.videos : [],
    credits: details.credits || { cast: [], crew: [] },
    stream_sources: Array.isArray(details.stream_sources) ? details.stream_sources : [],
    similar: Array.isArray(details.similar) ? details.similar : [],
    seasons: Array.isArray(details.seasons) ? details.seasons : [],
  };
};