import { Content } from '../types';

export const typedMovies: Content[] = [
  {
    id: "1",
    title: "Inception",
    type: "movie",
    poster: "/inception.jpg",
    year: "2010",
    genre: "Sci-Fi, Action",
    plot: "A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    rating: "8.8",
    backdrop: "/inception_backdrop.jpg",
    releaseDate: "2010-07-16",
    description: "A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    slug: "inception",
    genre_ids: [878, 28, 12],
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Example HLS URL
    subtitleUrls: [
      { lang: 'en', url: '/subtitles/inception-en.vtt', label: 'English' },
      { lang: 'es', url: '/subtitles/inception-es.vtt', label: 'Spanish' },
    ],
  },
  {
    id: "2",
    title: "The Dark Knight",
    type: "movie",
    poster: "/dark_knight.jpg",
    year: "2008",
    genre: "Action, Crime, Drama",
    plot: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    rating: "9.0",
    backdrop: "/dark_knight_backdrop.jpg",
    releaseDate: "2008-07-18",
    description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    slug: "the-dark-knight",
    genre_ids: [28, 80, 18],
    videoUrl: "https://embed.warezcdn.net/movie/60596", // Example embed URL (dummy)
    subtitleUrls: [
      { lang: 'en', url: '/subtitles/darkknight-en.vtt', label: 'English' },
    ],
  },
  {
    id: "3",
    title: "Pulp Fiction",
    type: "movie",
    poster: "/pulp_fiction.jpg",
    year: "1994",
    genre: "Crime, Drama",
    plot: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    rating: "8.9",
    backdrop: "/pulp_fiction_backdrop.jpg",
    releaseDate: "1994-10-14",
    description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    slug: "pulp-fiction",
    genre_ids: [80, 18],
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Example HLS URL
    subtitleUrls: [
      { lang: 'en', url: '/subtitles/pulpfiction-en.vtt', label: 'English' },
      { lang: 'fr', url: '/subtitles/pulpfiction-fr.vtt', label: 'French' },
    ],
  },
  {
    id: "4",
    title: "Interstellar",
    type: "movie",
    poster: "/interstellar.jpg",
    year: "2014",
    genre: "Sci-Fi, Drama",
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: "8.6",
    backdrop: "/interstellar_backdrop.jpg",
    releaseDate: "2014-11-07",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    slug: "interstellar",
    genre_ids: [878, 18],
    videoUrl: "https://embed.warezcdn.net/movie/157336", // Example embed URL (dummy)
    subtitleUrls: [], // No subtitles for embed for now
  },
  {
    id: "5",
    title: "Forrest Gump",
    type: "movie",
    poster: "/forrest_gump.jpg",
    year: "1994",
    genre: "Drama, Romance",
    plot: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
    rating: "8.8",
    backdrop: "/forrest_gump_backdrop.jpg",
    releaseDate: "1994-07-06",
    description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
    slug: "forrest-gump",
    genre_ids: [18, 10749],
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Example HLS URL
    subtitleUrls: [
      { lang: 'en', url: '/subtitles/forrestgump-en.vtt', label: 'English' },
    ],
  },
]; 