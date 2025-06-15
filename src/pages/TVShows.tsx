import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';
import { useSearchParams } from 'react-router-dom';

const TVShows = () => {
  const [
    searchParams,
    // setSearchParams // Uncomment if you need to set params from within the page
  ] = useSearchParams();

  const category = searchParams.get('category');
  const studio = searchParams.get('studio');

  const {
    tvShows,
    tvGenres,
    trending,
    topRated,
    popular,
    loadTvShows,
    loadTVGenres,
    loadTrending,
    loadTopRated,
    loadPopular,
  } = useStore();

  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    // Load content based on query parameters
    if (category === 'popular' && popular.length === 0) loadPopular();
    else if (category === 'top-rated' && topRated.length === 0) loadTopRated();
    else if (tvShows.length === 0 && !category && !studio) loadTvShows(); // Default load if no specific category/studio

    if (tvGenres.length === 0) loadTVGenres();
  }, [category, studio, tvShows.length, tvGenres.length, popular.length, topRated.length, loadTvShows, loadTVGenres, loadPopular, loadTopRated]);

  let displayedTVShows = tvShows;
  let pageTitle = 'TV Shows';

  if (studio) {
    switch (studio) {
      case 'netflix':
        // For now, using popular TV shows as a placeholder for Netflix Shows
        displayedTVShows = popular.filter(item => item.type === 'tv');
        pageTitle = 'Netflix Shows';
        break;
      case 'hbo':
        // For now, using top rated TV shows as a placeholder for HBO Shows
        displayedTVShows = topRated.filter(item => item.type === 'tv');
        pageTitle = 'HBO Shows';
        break;
      case 'apple-tv':
        displayedTVShows = trending.filter(item => item.type === 'tv'); // Placeholder
        pageTitle = 'Apple TV+';
        break;
      case 'prime-video':
        displayedTVShows = popular.filter(item => item.type === 'tv'); // Placeholder
        pageTitle = 'Prime Video';
        break;
      case 'shahid-vip':
        displayedTVShows = topRated.filter(item => item.type === 'tv'); // Placeholder
        pageTitle = 'Shahid VIP';
        break;
      case 'starz-play':
        displayedTVShows = trending.filter(item => item.type === 'tv'); // Placeholder
        pageTitle = 'Starz Play';
        break;
      case 'hulu':
        displayedTVShows = popular.filter(item => item.type === 'tv'); // Placeholder
        pageTitle = 'Hulu';
        break;
      default:
        break;
    }
  } else if (category) {
    switch (category) {
      case 'popular':
        displayedTVShows = popular.filter(item => item.type === 'tv');
        pageTitle = 'Popular Shows';
        break;
      case 'top-rated':
        displayedTVShows = topRated.filter(item => item.type === 'tv');
        pageTitle = 'Top Rated Shows';
        break;
      case 'trending':
        displayedTVShows = trending.filter(item => item.type === 'tv');
        pageTitle = 'Trending Shows';
        break;
      default:
        break;
    }
  }

  const filteredTVShows = selectedGenre
    ? displayedTVShows.filter((tvShow: any) => tvShow.genre_ids && tvShow.genre_ids.includes(Number(selectedGenre)))
    : displayedTVShows;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {pageTitle}
      </h1>
      <div className="mb-6">
        <label htmlFor="genre" className="mr-2 font-semibold">Genre:</label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          <option value="">All</option>
          {tvGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredTVShows.map((tvShow) => (
          <ContentCard key={tvShow.id} content={tvShow} size="medium" />
        ))}
      </div>
    </div>
  );
};

export default TVShows;