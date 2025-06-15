import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';
import AdBanner from '../components/AdBanner';
import ContentCarousel from '../components/ContentCarousel';
import PersonCard from '../components/PersonCard';
import { Content } from '../types';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    movies,
    tvShows,
    movieGenres,
    tvGenres,
    loadMoviesFromTMDB,
    loadTvShows,
    loadMovieGenres,
    loadTVGenres,
  } = useStore();

  const [content, setContent] = useState<Content | null>(null);
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);

  const TMDB_API_KEY = '4314ec40a0c67a8501b5b69e830c09d1'; // Make sure this is accessible or imported

  useEffect(() => {
    const allContent = [...movies, ...tvShows];
    const foundContent = allContent.find((item) => item.id === id);
    setContent(foundContent || null); // Ensure it's Content | null

    if (foundContent) {
      // Fetch recommendations from TMDB
      const fetchRecommendations = async () => {
        try {
          const type = foundContent.type === 'movie' ? 'movie' : 'tv';
          const res = await fetch(
            `https://api.themoviedb.org/3/${type}/${foundContent.id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          );
          const data = await res.json();
          const transformedRecommendations: Content[] = data.results.map((item: any) => ({
            id: item.id.toString(),
            title: item.title || item.name,
            type: item.media_type === 'movie' ? 'movie' : item.media_type === 'tv' ? 'tv' : 'other',
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
            year: (item.release_date || item.first_air_date || '').slice(0, 4),
            genre: '',
            plot: item.overview,
            rating: item.vote_average ? item.vote_average.toString() : '',
            backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '',
            releaseDate: item.release_date || item.first_air_date,
            description: item.overview,
            slug: (item.title || item.name || '').toLowerCase().replace(/\s+/g, '-'),
            genre_ids: item.genre_ids,
          }));
          setRecommendations(transformedRecommendations);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      };

      // Fetch cast and crew from TMDB
      const fetchCredits = async () => {
        try {
          const type = foundContent.type === 'movie' ? 'movie' : 'tv';
          const res = await fetch(
            `https://api.themoviedb.org/3/${type}/${foundContent.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const data = await res.json();
          setCast(data.cast.slice(0, 10)); // Limit to top 10 cast members
          setCrew(data.crew.filter((member: any) => member.job === 'Director' || member.job === 'Writer').slice(0, 5)); // Limit to directors/writers
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      };

      fetchRecommendations();
      fetchCredits();
    }

    if (movies.length === 0) loadMoviesFromTMDB();
    if (tvShows.length === 0) loadTvShows();
    if (movieGenres.length === 0) loadMovieGenres();
    if (tvGenres.length === 0) loadTVGenres();
  }, [id, movies, tvShows, movieGenres, tvGenres, loadMoviesFromTMDB, loadTvShows, loadMovieGenres, loadTVGenres]);

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-shrink-0 w-64 h-96 bg-gray-800 rounded-lg"></div>
          <div className="flex-grow text-center md:text-left">
            <div className="h-10 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6 mb-4"></div>
            <div className="h-12 bg-gray-800 rounded w-48"></div>
          </div>
        </div>
        <div className="mt-12">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-64 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getGenreNames = (genreIds: number[] | undefined, type: 'movie' | 'tv') => {
    if (!genreIds) return 'N/A';
    const genres = type === 'movie' ? movieGenres : tvGenres;
    return genreIds
      .map((genreId) => genres.find((g) => g.id === genreId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleWatchNow = () => {
    if (content.videoUrl) {
      navigate(`/player/${content.id}?videoUrl=${encodeURIComponent(content.videoUrl)}`);
    } else {
      alert('Video source not available for this content.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex-shrink-0">
          <img
            src={content.poster}
            alt={content.title}
            className="w-64 h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
          <p className="text-lg text-gray-400 mb-2">
            {content.year} | {content.type === 'movie' || content.type === 'tv' ? getGenreNames(content.genre_ids, content.type) : 'N/A'} | Rating: {content.rating}/10
          </p>
          <p className="text-gray-300 mb-4">{content.plot}</p>

          {/* Cast Section */}
          {cast.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Cast</h3>
              <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-2">
                {cast.map((person) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.character}
                    profilePath={person.profile_path}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Crew Section */}
          {crew.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Crew</h3>
              <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-2">
                {crew.map((person) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.job}
                    profilePath={person.profile_path}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleWatchNow}
            className="bg-accent hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 mt-8"
          >
            Watch Now
          </button>
        </div>
      </div>
      <AdBanner />
      {recommendations.length > 0 && (
        <ContentCarousel title="More Like This" content={recommendations} cardSize="small" />
      )}
    </div>
  );
};

export default Details;