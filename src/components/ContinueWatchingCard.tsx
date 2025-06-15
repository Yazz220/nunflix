import React from 'react';
import { Link } from 'react-router-dom';
import type { Content } from '../types';

interface ContinueWatchingCardProps {
  content: Content;
  progress: number; // 0-100
  episodeInfo?: string; // e.g., "S1, E3 | 12:34"
}

const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({ content, progress, episodeInfo }) => {
  return (
    <div className="w-64 h-40 flex-shrink-0 group cursor-pointer relative rounded-lg overflow-hidden">
      <Link to={`/player/${content.id}?videoUrl=${encodeURIComponent(content.videoUrl || '')}`} className="block w-full h-full">
        {/* Poster Image */}
        <img
          src={content.poster}
          alt={content.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {content.title}
          </h3>

          {episodeInfo && (
            <p className="text-xs text-gray-300 mb-2">{episodeInfo}</p>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
            <div
              className="bg-red-600 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Hover Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
              ▶ Resume
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
              Info
            </button>
          </div>
        </div>

        {/* Close/Remove Icon */}
        <button className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-700/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Link>
    </div>
  );
};

export default ContinueWatchingCard; 