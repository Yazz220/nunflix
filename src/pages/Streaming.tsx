import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';
import { useSearchParams } from 'react-router-dom';

const Streaming = () => {
  const [
    searchParams,
    // setSearchParams // Uncomment if you need to set params from within the page
  ] = useSearchParams();

  const provider = searchParams.get('provider');

  const {
    trending,
    popular,
    topRated,
    loadTrending,
    loadPopular,
    loadTopRated,
  } = useStore();

  useEffect(() => {
    if (trending.length === 0) loadTrending();
    if (popular.length === 0) loadPopular();
    if (topRated.length === 0) loadTopRated();
  }, [trending.length, popular.length, topRated.length, loadTrending, loadPopular, loadTopRated]);

  let displayedContent = [];
  let pageTitle = 'Streaming';

  if (provider) {
    switch (provider) {
      case 'netflix':
        displayedContent = [...popular.filter(item => item.type === 'tv'), ...popular.filter(item => item.type === 'movie')].slice(0, 12);
        pageTitle = 'Netflix Streaming';
        break;
      case 'hbo-max':
        displayedContent = [...topRated.filter(item => item.type === 'tv'), ...topRated.filter(item => item.type === 'movie')].slice(0, 12);
        pageTitle = 'HBO Max Streaming';
        break;
      case 'apple-tv':
        displayedContent = [...trending.filter(item => item.type === 'tv'), ...trending.filter(item => item.type === 'movie')].slice(0, 12);
        pageTitle = 'Apple TV+ Streaming';
        break;
      case 'disney':
        displayedContent = [...popular.filter(item => item.type === 'movie'), ...popular.filter(item => item.type === 'tv')].slice(0, 12);
        pageTitle = 'Disney+ Streaming';
        break;
      case 'prime-video':
        displayedContent = [...topRated.filter(item => item.type === 'movie'), ...topRated.filter(item => item.type === 'tv')].slice(0, 12);
        pageTitle = 'Prime Video Streaming';
        break;
      case 'shahid-vip':
        displayedContent = [...trending.filter(item => item.type === 'movie'), ...trending.filter(item => item.type === 'tv')].slice(0, 12);
        pageTitle = 'Shahid VIP Streaming';
        break;
      case 'starz-play':
        displayedContent = [...popular.filter(item => item.type === 'movie'), ...popular.filter(item => item.type === 'tv')].slice(0, 12);
        pageTitle = 'Starz Play Streaming';
        break;
      case 'hulu':
        displayedContent = [...topRated.filter(item => item.type === 'movie'), ...topRated.filter(item => item.type === 'tv')].slice(0, 12);
        pageTitle = 'Hulu Streaming';
        break;
      default:
        // If no specific provider or unknown provider, show a mix of popular content
        displayedContent = [...popular.slice(0, 8), ...topRated.slice(0, 8)];
        pageTitle = 'Streaming';
        break;
    }
  } else {
    // Default view for /streaming if no provider param
    displayedContent = [...popular.slice(0, 12), ...trending.slice(0, 12)];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {pageTitle}
      </h1>

      {displayedContent.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayedContent.map((content) => (
            <ContentCard key={content.id} content={content} size="medium" />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No streaming content found for this category.</p>
      )}
    </div>
  );
};

export default Streaming; 