interface Category {
  sort_by?: string;
  with_companies?: number;
  with_watch_providers?: number;
  watch_region?: string;
}

export const CATEGORY_MAP: { [key: string]: Category } = {
  trending: { sort_by: "popularity.desc" },
  popular: { sort_by: "popularity.desc" },
  top_rated: { sort_by: "vote_average.desc" },
  marvel: { with_companies: 420 },
  netflix: { with_watch_providers: 8, watch_region: 'US' },
  "disney+": { with_watch_providers: 337, watch_region: 'US' },
  "hbo max": { with_watch_providers: 1899, watch_region: 'US' },
  "apple tv+": { with_watch_providers: 2, watch_region: 'US' },
  "prime video": { with_watch_providers: 9, watch_region: 'US' },
  "shahid vip": { with_watch_providers: 1796, watch_region: 'AE' },
  "starz play": { with_watch_providers: 431, watch_region: 'AE' },
  hulu: { with_watch_providers: 15, watch_region: 'US' },
};
