import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';
import { useSearchParams } from 'react-router-dom';

const Movies = () => {
  const [
    searchParams,
    // setSearchParams // Uncomment if you need to set params from within the page
  ] = useSearchParams();

  const category = searchParams.get('category');
  const studio = searchParams.get('studio');

  const {
    movies,
    movieGenres,
    trending,
    topRated,
    popular,
    marvelMovies,
    dcMovies,
    paramountMovies,
    disneyMovies,
    loadMoviesFromTMDB,
    loadMovieGenres,
    loadTrending,
    loadTopRated,
    loadPopular,
    loadMarvelMovies,
    loadDCMovies,
    loadParamountMovies,
    loadDisneyMovies,
  } = useStore();

  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    // Load content based on query parameters
    if (studio === 'marvel' && marvelMovies.length === 0) loadMarvelMovies();
    else if (studio === 'dc' && dcMovies.length === 0) loadDCMovies();
    else if (studio === 'paramount' && paramountMovies.length === 0) loadParamountMovies();
    else if (studio === 'disney' && disneyMovies.length === 0) loadDisneyMovies();
    else if (category === 'trending' && trending.length === 0) loadTrending();
    else if (category === 'popular' && popular.length === 0) loadPopular();
    else if (category === 'top-rated' && topRated.length === 0) loadTopRated();
    else if (movies.length === 0 && !category && !studio) loadMoviesFromTMDB(); // Default load if no specific category/studio

    if (movieGenres.length === 0) loadMovieGenres();
  }, [category, studio, movies.length, movieGenres.length, trending.length, topRated.length, popular.length, marvelMovies.length, dcMovies.length, paramountMovies.length, disneyMovies.length, loadMoviesFromTMDB, loadMovieGenres, loadTrending, loadTopRated, loadPopular, loadMarvelMovies, loadDCMovies, loadParamountMovies, loadDisneyMovies]);

  let displayedMovies = movies;
  let pageTitle = 'Movies';

  if (studio) {
    switch (studio) {
      case 'marvel':
        displayedMovies = marvelMovies;
        pageTitle = 'Marvel Movies';
        break;
      case 'dc':
        displayedMovies = dcMovies;
        pageTitle = 'DC Movies';
        break;
      case 'paramount':
        displayedMovies = paramountMovies;
        pageTitle = 'Paramount Movies';
        break;
      case 'disney':
        displayedMovies = disneyMovies;
        pageTitle = 'Disney Movies';
        break;
      default:
        break;
    }
  } else if (category) {
    switch (category) {
      case 'trending':
        displayedMovies = trending;
        pageTitle = 'Trending Movies';
        break;
      case 'popular':
        displayedMovies = popular;
        pageTitle = 'Popular Movies';
        break;
      case 'top-rated':
        displayedMovies = topRated;
        pageTitle = 'Top Rated Movies';
        break;
      // Add more categories if needed
      default:
        break;
    }
  }

  const filteredMovies = selectedGenre
    ? displayedMovies.filter((movie: any) => movie.genre_ids && movie.genre_ids.includes(Number(selectedGenre)))
    : displayedMovies;

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
          {movieGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredMovies.map((movie) => (
          <ContentCard key={movie.id} content={movie} size="medium" />
        ))}
      </div>
    </div>
  );
};

export default Movies;