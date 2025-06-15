import React from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';

const SearchResults = () => {
  const { searchResults, searchTerm } = useStore();

  const movies = searchResults.filter((item) => item.type === 'movie');
  const tvShows = searchResults.filter((item) => item.type === 'tv');
  const hasResults = movies.length > 0 || tvShows.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{searchTerm}"
      </h1>
      {!hasResults && (
        <p className="text-gray-400 text-lg">No results found.</p>
      )}
      {movies.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        </div>
      )}
      {tvShows.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">TV Shows</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tvShows.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;