import React from 'react';
import { Link } from 'react-router-dom';
import type { Content } from '../types';

interface LiveSportCardProps {
  content: Content;
  eventTime: string; // e.g., "22:00"
  eventDetails: string; // e.g., "UFC Fight Night..."
}

const LiveSportCard: React.FC<LiveSportCardProps> = ({ content, eventTime, eventDetails }) => {
  return (
    <div className="w-64 flex-shrink-0 group cursor-pointer relative rounded-lg overflow-hidden">
      <Link to={`/details/${content.id}`} className="block w-full h-full">
        {/* Background Image/Placeholder */}
        <img
          src={content.poster}
          alt={content.title}
          className="w-full h-full object-cover brightness-75"
        />

        {/* LIVE Tag */}
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase">
          Live
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {content.title}
          </h3>

          <p className="text-xs text-gray-300 mb-2">{eventDetails}</p>
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{eventTime}</span>
          </div>

          {/* Hover Actions (optional, similar to continue watching or details) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
              ▶ Watch Live
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
              Info
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LiveSportCard; 