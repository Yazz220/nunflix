import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';
import { useSearchParams } from 'react-router-dom';
import { Content } from '../types';

const demoCurated = [
  {
    id: 1,
    title: 'Feel-Good Movies',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Epic TV Adventures',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  },
];

const Discover = () => {
  const [
    searchParams,
    // setSearchParams // Uncomment if you need to set params from within the page
  ] = useSearchParams();

  const sort = searchParams.get('sort');
  const genre = searchParams.get('genre');
  const universe = searchParams.get('universe');

  const {
    trending,
    popular,
    topRated,
    marvelUniverse,
    dcUniverse,
    movieGenres,
    tvGenres,
    loadTrending,
    loadPopular,
    loadTopRated,
    loadMarvelUniverse,
    loadDCUniverse,
    loadMovieGenres,
    loadTVGenres,
  } = useStore();

  const [selectedMediaType, setSelectedMediaType] = useState('all'); // 'all', 'movie', 'tv'
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (sort === 'trending-today' && trending.length === 0) loadTrending();
    else if ((sort === 'most-popular' || sort === 'most-viewed') && popular.length === 0) loadPopular();
    else if (sort === 'top-rated' && topRated.length === 0) loadTopRated();
    else if (universe === 'marvel' && marvelUniverse.length === 0) loadMarvelUniverse();
    else if (universe === 'dc' && dcUniverse.length === 0) loadDCUniverse();

    if (movieGenres.length === 0) loadMovieGenres();
    if (tvGenres.length === 0) loadTVGenres();
  }, [sort, genre, universe, trending.length, popular.length, topRated.length, marvelUniverse.length, dcUniverse.length, movieGenres.length, tvGenres.length, loadTrending, loadPopular, loadTopRated, loadMarvelUniverse, loadDCUniverse, loadMovieGenres, loadTVGenres]);

  let displayedContent: Content[] = [];
  let pageTitle = 'Discover';

  if (universe) {
    switch (universe) {
      case 'marvel':
        displayedContent = marvelUniverse;
        pageTitle = 'Marvel Universe';
        break;
      case 'dc':
        displayedContent = dcUniverse;
        pageTitle = 'DC Universe';
        break;
      default:
        break;
    }
  } else if (sort) {
    switch (sort) {
      case 'trending-today':
        displayedContent = trending;
        pageTitle = 'Trending Today';
        break;
      case 'top-rated':
        displayedContent = topRated;
        pageTitle = 'Top Rated';
        break;
      case 'most-popular':
      case 'most-viewed': // Grouping most-popular and most-viewed for now
        displayedContent = popular;
        pageTitle = 'Most Popular';
        break;
      default:
        break;
    }
  } else if (genre === 'anime') {
    // Filter by Animation genre ID 16 for anime
    displayedContent = popular.filter(item => item.genre_ids?.includes(16) && (item.type === 'movie' || item.type === 'tv'));
    pageTitle = 'Anime';
  } else {
    // Default discover content if no specific filter
    displayedContent = [...trending.slice(0, 20), ...popular.slice(0, 20), ...topRated.slice(0, 20)];
  }

  // Further filter by media type (movie/tv)
  let finalFilteredContent = displayedContent;
  if (selectedMediaType !== 'all') {
    finalFilteredContent = displayedContent.filter(item => item.type === selectedMediaType);
  }

  // Filter by genre from the dropdown if selectedGenreId is set
  if (selectedGenreId) {
    finalFilteredContent = finalFilteredContent.filter(item =>
      item.genre_ids && item.genre_ids.includes(Number(selectedGenreId))
    );
  }

  // Filter by year
  if (selectedYear) {
    finalFilteredContent = finalFilteredContent.filter(item => item.year === selectedYear);
  }

  const availableYears = Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() - i).toString());
  const allGenres = [...movieGenres, ...tvGenres.filter(tvG => !movieGenres.some(movieG => movieG.id === tvG.id))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Content Type Filter */}
        <div>
          <label htmlFor="media-type" className="mr-2 font-semibold">Content Type:</label>
          <select
            id="media-type"
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value as 'all' | 'movie' | 'tv')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div>
          <label htmlFor="genre-filter" className="mr-2 font-semibold">Genre:</label>
          <select
            id="genre-filter"
            value={selectedGenreId}
            onChange={(e) => setSelectedGenreId(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="">All Genres</option>
            {allGenres.map((genreOption) => (
              <option key={genreOption.id} value={genreOption.id}>
                {genreOption.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label htmlFor="year-filter" className="mr-2 font-semibold">Year:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {finalFilteredContent.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {finalFilteredContent.map((content) => (
            <ContentCard key={content.id} content={content} size="medium" />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No content found for these filters.</p>
      )}

      {/* Demo Curated Carousels - Moved below main filterable content */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Curated Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {demoCurated.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <button className="bg-accent hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Explore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover; 