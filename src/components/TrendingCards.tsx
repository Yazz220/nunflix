import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import { Content } from '../types';

const TrendingCards: React.FC = () => {
  const { trendingDay, trendingWeek, loadTrendingDay, loadTrendingWeek } = useStore();
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');

  useEffect(() => {
    loadTrendingDay();
    loadTrendingWeek();
  }, [loadTrendingDay, loadTrendingWeek]);

  const displayedTrending: Content[] = timeWindow === 'day' ? trendingDay : trendingWeek;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending ~</h2>
          <div className="flex rounded-full bg-gray-800 p-1">
            <button
              onClick={() => setTimeWindow('day')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                ${timeWindow === 'day' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeWindow('week')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                ${timeWindow === 'week' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              Week
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTrending.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={item.backdrop || item.poster}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                Trending Now
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.plot || item.description}
                </p>
                <div className="flex space-x-3">
                  <Link to={`/details/${item.id}`} className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2">
                    <span>Details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link to={`/player/${item.id}?videoUrl=${encodeURIComponent(item.videoUrl || '')}`} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                    <span>Watch</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingCards;
