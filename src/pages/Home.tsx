import React, { useEffect, useRef } from 'react';
import HeroSection from '../components/HeroSection';
import ContentCarousel from '../components/ContentCarousel';
import TrendingCards from '../components/TrendingCards';
import AdBanner from '../components/AdBanner';
import ContinueWatchingCard from '../components/ContinueWatchingCard';
import LiveSportCard from '../components/LiveSportCard';
import useStore from '../store/useStore';
import { Content } from '../types';

const Home: React.FC = () => {
  const {
    trending,
    topRated,
    popular,
    netflixPicks,
    primeShows,
    movies,
    tvShows,
    marvelContent,
    dcContent,
    emotionalJourneys,
    loadTrending,
    loadTopRated,
    loadPopular,
    loadNetflixPicks,
    loadPrimeShows,
    loadMoviesFromTMDB,
    loadTvShows,
    loadMarvelContent,
    loadDCContent,
    loadEmotionalJourneys,
  } = useStore();

  // Dummy data for Continue Watching (replace with actual data later)
  const continueWatchingContent: (Content & { progress: number; episodeInfo?: string })[] = [
    {
      id: 'tt15367676', // Example ID for Lioness
      title: 'Lioness',
      type: 'tv',
      poster: 'https://image.tmdb.org/t/p/w500/y6Zgr2LdG0l80jG703d1hL32RzT.jpg',
      year: '2023',
      plot: 'N/A',
      rating: '8.1',
      progress: 75,
      episodeInfo: 'S1, E3 | The Compass Points Home',
      videoUrl: 'https://example.com/lioness_s1e3.m3u8',
    },
    {
      id: 'tt1190634', // Example ID for Mercy for None
      title: 'Mercy for None',
      type: 'tv',
      poster: 'https://image.tmdb.org/t/p/w500/iJCVG420P5D748rP3s6L03hS5o.jpg',
      year: '2024',
      plot: 'N/A',
      rating: '8.0',
      progress: 30,
      episodeInfo: 'S1, E1 | Episode 1',
      videoUrl: 'https://example.com/mercyfornone_s1e1.m3u8',
    },
    {
      id: 'tt15483286', // Example ID for Cyberpunk: Edgerunners
      title: 'Cyberpunk: Edgerunners',
      type: 'tv',
      poster: 'https://image.tmdb.org/t/p/w500/z0BwQj2L3Z5x7x7r6X9B5r8F3C7.jpg',
      year: '2022',
      plot: 'N/A',
      rating: '8.6',
      progress: 80,
      episodeInfo: 'S1, E10 | Let You Down',
      videoUrl: 'https://example.com/edgerunners_s1e10.m3u8',
    },
    {
      id: 'tt15682852', // Example ID for All of Us Are Dead
      title: 'All of Us Are Dead',
      type: 'tv',
      poster: 'https://image.tmdb.org/t/p/w500/qj8f2vF47P4P40D6yD711C7z5Q.jpg',
      year: '2022',
      plot: 'N/A',
      rating: '8.0',
      progress: 60,
      episodeInfo: 'S1, E1 | Episode 1',
      videoUrl: 'https://example.com/allofusaredead_s1e1.m3u8',
    },
    {
      id: 'tt1745960', // Example ID for Top Gun: Maverick
      title: 'Top Gun: Maverick',
      type: 'movie',
      poster: 'https://image.tmdb.org/t/p/w500/yY3w9s78M8hQ41.jpg',
      year: '2022',
      plot: 'N/A',
      rating: '8.3',
      progress: 90,
      episodeInfo: '2022 • 131 min',
      videoUrl: 'https://example.com/topgunmaverick.m3u8',
    },
  ];

  // Dummy data for Live Sports (replace with actual data later)
  const liveSportsContent: (Content & { eventTime: string; eventDetails: string })[] = [
    {
      id: 'live-ufc',
      title: 'UFC Fight Night',
      type: 'other',
      poster: 'https://image.tmdb.org/t/p/w500/y6Zgr2LdG0l80jG703d1hL32RzT.jpg', // Placeholder image
      year: '',
      plot: '',
      rating: '',
      eventTime: '22:00',
      eventDetails: 'UFC Fight Night Vs. Buckley',
    },
    {
      id: 'live-football-angel',
      title: 'Football Match',
      type: 'other',
      poster: 'https://image.tmdb.org/t/p/w500/iJCVG420P5D748rP3s6L03hS5o.jpg', // Placeholder image
      year: '',
      plot: '',
      rating: '',
      eventTime: '22:00',
      eventDetails: 'Angel City Vs. North Carolina',
    },
    {
      id: 'live-basketball',
      title: 'Basketball Match',
      type: 'other',
      poster: 'https://image.tmdb.org/t/p/w500/z0BwQj2L3Z5x7x7r6X9B5r8F3C7.jpg', // Placeholder image
      year: '',
      plot: '',
      rating: '',
      eventTime: '22:00',
      eventDetails: 'Vancouver Warriors Vs. Seattle Seawolves',
    },
  ];

  const continueWatchingRef = useRef<HTMLDivElement>(null);
  const liveSportsRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (trending.length === 0) loadTrending();
    if (topRated.length === 0) loadTopRated();
    if (popular.length === 0) loadPopular();
    if (netflixPicks.length === 0) loadNetflixPicks();
    if (primeShows.length === 0) loadPrimeShows();
    if (movies.length === 0) loadMoviesFromTMDB();
    if (tvShows.length === 0) loadTvShows();
    if (marvelContent.length === 0) loadMarvelContent();
    if (dcContent.length === 0) loadDCContent();
    if (emotionalJourneys.length === 0) loadEmotionalJourneys();
  }, [trending.length, topRated.length, popular.length, netflixPicks.length, primeShows.length, movies.length, tvShows.length, marvelContent.length, dcContent.length, emotionalJourneys.length, loadTrending, loadTopRated, loadPopular, loadNetflixPicks, loadPrimeShows, loadMoviesFromTMDB, loadTvShows, loadMarvelContent, loadDCContent, loadEmotionalJourneys]);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        {/* Continue Watching Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Continue Watching</h2>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                Edit
              </button>
              <button onClick={() => scrollLeft(continueWatchingRef)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={() => scrollRight(continueWatchingRef)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div ref={continueWatchingRef} className="flex overflow-x-scroll scrollbar-hide space-x-6 pb-4">
            {continueWatchingContent.length > 0 ? (
              continueWatchingContent.map((content) => (
                <ContinueWatchingCard
                  key={content.id}
                  content={content}
                  progress={content.progress}
                  episodeInfo={content.episodeInfo}
                />
              ))
            ) : (
              <p className="text-gray-400">No content to continue watching.</p>
            )}
          </div>
        </div>

        {/* Live Sports Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Live Sports</h2>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                Show All
              </button>
              <button onClick={() => scrollLeft(liveSportsRef)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={() => scrollRight(liveSportsRef)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div ref={liveSportsRef} className="flex overflow-x-scroll scrollbar-hide space-x-6 pb-4">
            {liveSportsContent.length > 0 ? (
              liveSportsContent.map((content) => (
                <LiveSportCard
                  key={content.id}
                  content={content}
                  eventTime={content.eventTime}
                  eventDetails={content.eventDetails}
                />
              ))
            ) : (
              <p className="text-gray-400">No live sports available.</p>
            )}
          </div>
        </div>

        <TrendingCards />
        <AdBanner />
        <ContentCarousel title="Trending Now" content={trending} />
        <ContentCarousel title="Top Rated" content={topRated} />
        <ContentCarousel title="Popular Movies & TV" content={popular} />
        <ContentCarousel title="Netflix Picks" content={netflixPicks} />
        <ContentCarousel title="Prime Shows" content={primeShows} />
        <ContentCarousel title="Marvel Studios ~" content={marvelContent} showMediaTypeToggle={true} initialMediaType="all" />
        <ContentCarousel title="CW ~" content={dcContent} showMediaTypeToggle={true} initialMediaType="all" />
        <ContentCarousel title="Emotional Journeys ~" content={emotionalJourneys} />
      </div>
    </div>
  );
};

export default Home;