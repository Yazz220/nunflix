import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const HeroSection: React.FC = () => {
  const {
    trending,
    loadTrending,
    movieGenres,
    tvGenres,
    loadMovieGenres,
    loadTVGenres,
    addToMyList,
    removeFromMyList,
    myList,
  } = useStore();

  const [featuredContent, setFeaturedContent] = useState<any>(null);

  useEffect(() => {
    if (trending.length === 0) loadTrending();
    if (movieGenres.length === 0) loadMovieGenres();
    if (tvGenres.length === 0) loadTVGenres();
  }, [trending.length, movieGenres.length, tvGenres.length, loadTrending, loadMovieGenres, loadTVGenres]);

  useEffect(() => {
    if (trending.length > 0) {
      // For demonstration, prioritize "How to Train Your Dragon" if available
      const howToTrainYourDragon = trending.find(item => item.title === "How to Train Your Dragon");
      if (howToTrainYourDragon) {
        setFeaturedContent(howToTrainYourDragon);
      } else {
        setFeaturedContent(trending[Math.floor(Math.random() * trending.length)]);
      }
    }
  }, [trending]);

  const getGenreNames = (genreIds: number[] | undefined, type: 'movie' | 'tv') => {
    if (!genreIds) return 'N/A';
    const genres = type === 'movie' ? movieGenres : tvGenres;
    return genreIds
      .map((genreId) => genres.find((g) => g.id === genreId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const isBookmarked = featuredContent && myList.some(item => item.id === featuredContent.id);

  const handleBookmarkToggle = () => {
    if (!featuredContent) return;
    if (isBookmarked) {
      removeFromMyList(featuredContent.id);
    } else {
      addToMyList(featuredContent);
    }
  };

  if (!featuredContent) {
    return <div className="w-full h-[60vh] bg-gray-900 animate-pulse"></div>;
  }

  return (
    <section
      className="relative h-[60vh] md:h-[70vh] bg-cover bg-center flex items-end overflow-hidden"
      style={{ backgroundImage: `url(${featuredContent.backdrop})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      <div className="relative z-10 p-8 md:p-12 w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          {featuredContent.title}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          {featuredContent.year && `${featuredContent.year} | `}
          {featuredContent.type === 'movie' || featuredContent.type === 'tv' ? getGenreNames(featuredContent.genre_ids, featuredContent.type) : 'N/A'}
          {featuredContent.quality && ` | ${featuredContent.quality}`}
        </p>
        <p className="text-gray-400 text-sm md:text-base line-clamp-3 mb-6">
          {featuredContent.plot}
        </p>
        <div className="flex space-x-4">
          <Link
            to={`/player/${featuredContent.id}?videoUrl=${encodeURIComponent(featuredContent.videoUrl || '')}`}
            className="bg-accent hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Watch Now
          </Link>
          <button
            onClick={handleBookmarkToggle}
            className={`p-3 rounded-full transition-colors duration-200 ${isBookmarked ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
            aria-label="Add to My List"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {/* Navigation dots - can be made dynamic based on trending content */}
          {trending.slice(0, 5).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-gray-500'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
