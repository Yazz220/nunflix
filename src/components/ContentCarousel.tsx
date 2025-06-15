import type React from 'react';
import { useRef, useState, useEffect } from 'react';
import type { Content } from '../types';
import ContentCard from './ContentCard';

interface ContentCarouselProps {
  title: string;
  emoji?: string;
  subtitle?: string;
  content: Content[];
  cardSize?: 'small' | 'medium' | 'large';
  showMediaTypeToggle?: boolean;
  initialMediaType?: 'movie' | 'tv' | 'all';
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  title,
  emoji,
  subtitle,
  content,
  cardSize = 'medium',
  showMediaTypeToggle = false,
  initialMediaType = 'all',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'movie' | 'tv' | 'all'>(initialMediaType);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredContent = content.filter(item => {
    if (selectedMediaType === 'all') return true;
    return item.type === selectedMediaType;
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bebas text-white flex items-center">
            {title}
            {emoji && <span className="ml-2 text-xl">{emoji}</span>}
          </h2>
          {showMediaTypeToggle && (
            <div className="flex rounded-full bg-gray-800 p-1">
              <button
                onClick={() => setSelectedMediaType('movie')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                  ${selectedMediaType === 'movie' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
              >
                Movies
              </button>
              <button
                onClick={() => setSelectedMediaType('tv')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                  ${selectedMediaType === 'tv' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
              >
                TV Shows
              </button>
            </div>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <ContentCard
                  key={item.id}
                  content={item}
                  size={cardSize}
                />
              ))
            ) : (
              <p className="text-gray-400">No content found for this category.</p>
            )}
          </div>

          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;
