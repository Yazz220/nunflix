export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'other';
  poster: string;
  year: string;
  genre?: string;
  plot: string;
  rating: string;
  backdrop?: string;
  releaseDate?: string;
  description?: string;
  slug?: string;
  genre_ids?: number[];
  videoUrl?: string;
  subtitleUrls?: { lang: string; url: string; label: string }[];
  quality?: string;
}

export interface LiveSport {
  id: number;
  title: string;
  sport: string;
  time: string;
  teams?: string;
  isLive: boolean;
}

export interface TrendingCard {
  id: number;
  title: string;
  description: string;
  backdrop: string;
  type: 'movie' | 'tv';
  slug: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
}

export interface Genre {
  id: number;
  name: string;
}
