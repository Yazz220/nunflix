import { create } from 'zustand';
import moviesData from '../data/movies.json';
import { Content } from '../types';

const typedMovies: Content[] = moviesData.map((movie) => ({
  id: movie.imdbID,
  title: movie.Title,
  type: 'movie',
  poster: movie.Poster,
  year: movie.Year,
  genre: movie.Genre,
  plot: movie.Plot,
  rating: movie.imdbRating,
}));

interface AppState {
  movies: Content[];
  tvShows: Content[];
  trending: Content[];
  topRated: Content[];
  popular: Content[];
  netflixPicks: Content[];
  primeShows: Content[];
  marvelMovies: Content[];
  dcMovies: Content[];
  paramountMovies: Content[];
  disneyMovies: Content[];
  marvelUniverse: Content[];
  dcUniverse: Content[];
  movieGenres: { id: number; name: string }[];
  tvGenres: { id: number; name: string }[];
  searchTerm: string;
  searchResults: Content[];
  watchHistory: Content[];
  trendingDay: Content[];
  trendingWeek: Content[];
  marvelContent: Content[];
  dcContent: Content[];
  emotionalJourneys: Content[];
  myList: Content[];
  setMovies: (movies: Content[]) => void;
  setTvShows: (tvShows: Content[]) => void;
  setTrending: (trending: Content[]) => void;
  setTopRated: (topRated: Content[]) => void;
  setPopular: (popular: Content[]) => void;
  setNetflixPicks: (picks: Content[]) => void;
  setPrimeShows: (shows: Content[]) => void;
  setMarvelMovies: (movies: Content[]) => void;
  setDCMovies: (movies: Content[]) => void;
  setParamountMovies: (movies: Content[]) => void;
  setDisneyMovies: (movies: Content[]) => void;
  setMarvelUniverse: (content: Content[]) => void;
  setDCUniverse: (content: Content[]) => void;
  setMovieGenres: (genres: { id: number; name: string }[]) => void;
  setTVGenres: (genres: { id: number; name: string }[]) => void;
  setSearchTerm: (term: string) => void;
  performSearch: () => void;
  loadTvShows: () => Promise<void>;
  loadTrending: () => Promise<void>;
  loadTopRated: () => Promise<void>;
  loadPopular: () => Promise<void>;
  loadMovieGenres: () => Promise<void>;
  loadTVGenres: () => Promise<void>;
  loadMoviesFromTMDB: () => Promise<void>;
  loadNetflixPicks: () => Promise<void>;
  loadPrimeShows: () => Promise<void>;
  loadMarvelMovies: () => Promise<void>;
  loadDCMovies: () => Promise<void>;
  loadParamountMovies: () => Promise<void>;
  loadDisneyMovies: () => Promise<void>;
  loadMarvelUniverse: () => Promise<void>;
  loadDCUniverse: () => Promise<void>;
  addToWatchHistory: (content: Content) => void;
  clearWatchHistory: () => void;
  loadTrendingDay: () => Promise<void>;
  loadTrendingWeek: () => Promise<void>;
  loadMarvelContent: () => Promise<void>;
  loadDCContent: () => Promise<void>;
  loadEmotionalJourneys: () => Promise<void>;
  addToMyList: (content: Content) => void;
  removeFromMyList: (id: string) => void;
  clearMyList: () => void;
}

const TMDB_API_KEY = '4314ec40a0c67a8501b5b69e830c09d1';

async function fetchPopularTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();
  return data.results.map((show: any) => ({
    id: show.id.toString(),
    title: show.name,
    type: 'tv',
    poster: show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : '',
    year: show.first_air_date ? show.first_air_date.slice(0, 4) : '',
    genre: '', // Optionally fetch genres separately
    plot: show.overview,
    rating: show.vote_average ? show.vote_average.toString() : '',
    backdrop: show.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}`
      : '',
    releaseDate: show.first_air_date,
    description: show.overview,
    slug: show.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

async function fetchTMDBList(endpoint: string, type: 'movie' | 'tv' | 'all', companyId?: number, genreId?: number) {
  let url = `https://api.themoviedb.org/3/${type}/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
  if (companyId) {
    url = `https://api.themoviedb.org/3/discover/${type === 'all' ? 'movie' : type}?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&with_companies=${companyId}`;
  }
  if (genreId) {
    url = `https://api.themoviedb.org/3/discover/${type === 'all' ? 'movie' : type}?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&with_genres=${genreId}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  return data.results.map((item: any) => ({
    id: item.id.toString(),
    title: item.title || item.name,
    type: item.media_type === 'movie' ? 'movie' : item.media_type === 'tv' ? 'tv' : 'other',
    poster: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : '',
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    genre: '',
    plot: item.overview,
    rating: item.vote_average ? item.vote_average.toString() : '',
    backdrop: item.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
      : '',
    releaseDate: item.release_date || item.first_air_date,
    description: item.overview,
    slug: (item.title || item.name || '').toLowerCase().replace(/\s+/g, '-'),
    genre_ids: item.genre_ids,
  }));
}

async function fetchMovieGenres() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
}

async function fetchPopularMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    type: 'movie',
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
    year: item.release_date ? item.release_date.slice(0, 4) : '',
    genre: '',
    plot: item.overview,
    rating: item.vote_average ? item.vote_average.toString() : '',
    backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '',
    releaseDate: item.release_date,
    description: item.overview,
    slug: item.title.toLowerCase().replace(/\s+/g, '-'),
    genre_ids: item.genre_ids,
  }));
}

async function fetchTVGenres() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
}

async function fetchPopularTVShowsWithGenres() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();
  return data.results.map((show: any) => ({
    id: show.id.toString(),
    title: show.name,
    type: 'tv',
    poster: show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : '',
    year: show.first_air_date ? show.first_air_date.slice(0, 4) : '',
    genre: '',
    plot: show.overview,
    rating: show.vote_average ? show.vote_average.toString() : '',
    backdrop: show.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}`
      : '',
    releaseDate: show.first_air_date,
    description: show.overview,
    slug: show.name.toLowerCase().replace(/\s+/g, '-'),
    genre_ids: show.genre_ids,
  }));
}

async function fetchTrendingAll(timeWindow: 'day' | 'week') {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  const data = await res.json();
  return data.results.map((item: any) => ({
    id: item.id.toString(),
    title: item.title || item.name,
    type: item.media_type === 'movie' ? 'movie' : item.media_type === 'tv' ? 'tv' : 'other',
    poster: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : '',
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    genre: '',
    plot: item.overview,
    rating: item.vote_average ? item.vote_average.toString() : '',
    backdrop: item.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
      : '',
    releaseDate: item.release_date || item.first_air_date,
    description: item.overview,
    slug: (item.title || item.name || '').toLowerCase().replace(/\s+/g, '-'),
    genre_ids: item.genre_ids,
  }));
}

const useStore = create<AppState>((set, get) => ({
  movies: typedMovies,
  tvShows: [],
  trending: [],
  topRated: [],
  popular: [],
  netflixPicks: [],
  primeShows: [],
  marvelMovies: [],
  dcMovies: [],
  paramountMovies: [],
  disneyMovies: [],
  marvelUniverse: [],
  dcUniverse: [],
  movieGenres: [],
  tvGenres: [],
  searchTerm: '',
  searchResults: [],
  watchHistory: JSON.parse(localStorage.getItem('watchHistory') || '[]'),
  trendingDay: [],
  trendingWeek: [],
  marvelContent: [],
  dcContent: [],
  emotionalJourneys: [],
  myList: JSON.parse(localStorage.getItem('myList') || '[]'),
  setMovies: (movies) => set({ movies }),
  setTvShows: (tvShows) => set({ tvShows }),
  setTrending: (trending) => set({ trending }),
  setTopRated: (topRated) => set({ topRated }),
  setPopular: (popular) => set({ popular }),
  setNetflixPicks: (picks) => set({ netflixPicks: picks }),
  setPrimeShows: (shows) => set({ primeShows: shows }),
  setMarvelMovies: (movies) => set({ marvelMovies: movies }),
  setDCMovies: (movies) => set({ dcMovies: movies }),
  setParamountMovies: (movies) => set({ paramountMovies: movies }),
  setDisneyMovies: (movies) => set({ disneyMovies: movies }),
  setMarvelUniverse: (content) => set({ marvelUniverse: content }),
  setDCUniverse: (content) => set({ dcUniverse: content }),
  setMovieGenres: (genres) => set({ movieGenres: genres }),
  setTVGenres: (genres) => set({ tvGenres: genres }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  performSearch: () => {
    const { movies, tvShows, searchTerm } = get();
    const allContent = [...movies, ...tvShows];
    const results = allContent.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    set({ searchResults: results });
  },
  loadTvShows: async () => {
    const tvShows = await fetchPopularTVShowsWithGenres();
    set({ tvShows });
  },
  loadTrending: async () => {
    const trendingMovies = await fetchTMDBList('popular', 'movie');
    const trendingTV = await fetchTMDBList('popular', 'tv');
    set({ trending: [...trendingMovies.slice(0, 10), ...trendingTV.slice(0, 10)] });
  },
  loadTopRated: async () => {
    const topRatedMovies = await fetchTMDBList('top_rated', 'movie');
    const topRatedTV = await fetchTMDBList('top_rated', 'tv');
    set({ topRated: [...topRatedMovies.slice(0, 10), ...topRatedTV.slice(0, 10)] });
  },
  loadPopular: async () => {
    const popularMovies = await fetchTMDBList('popular', 'movie');
    const popularTV = await fetchTMDBList('popular', 'tv');
    set({ popular: [...popularMovies.slice(10, 20), ...popularTV.slice(10, 20)] });
  },
  loadMovieGenres: async () => {
    const genres = await fetchMovieGenres();
    set({ movieGenres: genres });
  },
  loadTVGenres: async () => {
    const genres = await fetchTVGenres();
    set({ tvGenres: genres });
  },
  loadMoviesFromTMDB: async () => {
    const movies = await fetchPopularMovies();
    set({ movies: [...get().movies, ...movies] });
  },
  loadNetflixPicks: async () => {
    const netflixCompanyId = 213; // Netflix company ID on TMDB
    const picks = await fetchTMDBList('popular', 'tv', netflixCompanyId);
    set({ netflixPicks: picks });
  },
  loadPrimeShows: async () => {
    const amazonCompanyId = 10247; // Amazon Prime Video company ID on TMDB
    const shows = await fetchTMDBList('popular', 'tv', amazonCompanyId);
    set({ primeShows: shows });
  },
  loadMarvelMovies: async () => {
    const marvelCompanyId = 420; // Marvel Studios company ID
    const movies = await fetchTMDBList('popular', 'movie', marvelCompanyId);
    set({ marvelMovies: movies });
  },
  loadDCMovies: async () => {
    const dcCompanyId = 174; // Warner Bros. Pictures (for DC content)
    const movies = await fetchTMDBList('popular', 'movie', dcCompanyId);
    set({ dcMovies: movies });
  },
  loadParamountMovies: async () => {
    const paramountCompanyId = 4;
    const movies = await fetchTMDBList('popular', 'movie', paramountCompanyId);
    set({ paramountMovies: movies });
  },
  loadDisneyMovies: async () => {
    const disneyCompanyId = 2;
    const movies = await fetchTMDBList('popular', 'movie', disneyCompanyId);
    set({ disneyMovies: movies });
  },
  loadMarvelUniverse: async () => {
    // For simplicity, combine Marvel Movies and Marvel TV shows (if we had them)
    const marvelCompanyId = 420;
    const movies = await fetchTMDBList('popular', 'movie', marvelCompanyId);
    set({ marvelUniverse: movies });
  },
  loadDCUniverse: async () => {
    const dcCompanyId = 174;
    const movies = await fetchTMDBList('popular', 'movie', dcCompanyId);
    set({ dcUniverse: movies });
  },
  addToWatchHistory: (content: Content) => {
    set((state) => {
      const existingIndex = state.watchHistory.findIndex((item) => item.id === content.id);
      let newHistory: Content[];
      if (existingIndex !== -1) {
        // If content already exists, remove it to re-add at the top (most recent)
        newHistory = [content, ...state.watchHistory.filter(item => item.id !== content.id)];
      } else {
        newHistory = [content, ...state.watchHistory];
      }
      // Cap history to a reasonable number, e.g., 50 items
      newHistory = newHistory.slice(0, 50);
      localStorage.setItem('watchHistory', JSON.stringify(newHistory));
      return { watchHistory: newHistory };
    });
  },
  clearWatchHistory: () => {
    localStorage.removeItem('watchHistory');
    set({ watchHistory: [] });
  },
  loadTrendingDay: async () => {
    const trendingContent = await fetchTrendingAll('day');
    set({ trendingDay: trendingContent });
  },
  loadTrendingWeek: async () => {
    const trendingContent = await fetchTrendingAll('week');
    set({ trendingWeek: trendingContent });
  },
  loadMarvelContent: async () => {
    const marvelCompanyId = 420;
    const movies = await fetchTMDBList('popular', 'movie', marvelCompanyId);
    const tvShows = await fetchTMDBList('popular', 'tv', marvelCompanyId);
    set({ marvelContent: [...movies, ...tvShows] });
  },
  loadDCContent: async () => {
    const dcCompanyId = 174;
    const movies = await fetchTMDBList('popular', 'movie', dcCompanyId);
    const tvShows = await fetchTMDBList('popular', 'tv', dcCompanyId);
    set({ dcContent: [...movies, ...tvShows] });
  },
  loadEmotionalJourneys: async () => {
    const dramaGenreId = 18; // TMDB genre ID for Drama
    const emotionalContent = await fetchTMDBList('popular', 'movie', undefined, dramaGenreId);
    set({ emotionalJourneys: emotionalContent });
  },
  addToMyList: (content: Content) => {
    set((state) => {
      const existingIndex = state.myList.findIndex((item) => item.id === content.id);
      let newList: Content[];
      if (existingIndex !== -1) {
        // If content already exists, remove it to re-add at the top (most recent)
        newList = [content, ...state.myList.filter(item => item.id !== content.id)];
      } else {
        newList = [content, ...state.myList];
      }
      // Cap list to a reasonable number, e.g., 50 items
      newList = newList.slice(0, 50);
      localStorage.setItem('myList', JSON.stringify(newList));
      return { myList: newList };
    });
  },
  removeFromMyList: (id: string) => {
    set((state) => {
      const newList = state.myList.filter(item => item.id !== id);
      localStorage.setItem('myList', JSON.stringify(newList));
      return { myList: newList };
    });
  },
  clearMyList: () => {
    localStorage.removeItem('myList');
    set({ myList: [] });
  },
}));

export default useStore;