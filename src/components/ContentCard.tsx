import React from 'react';
import { Link } from 'react-router-dom';
import type { Content } from '../types';

interface ContentCardProps {
  content: Content;
  size?: 'small' | 'medium' | 'large';
}

const ContentCard: React.FC<ContentCardProps> = ({ content, size = 'medium' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-40 h-60';
      case 'large':
        return 'w-64 h-96';
      default:
        return 'w-48 h-72';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '4K':
        return 'bg-purple-600';
      case 'HD':
      case '1080p':
      case '1080P':
        return 'bg-blue-600';
      case 'CAM':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className={`${getSizeClasses()} flex-shrink-0 group cursor-pointer`}>
      <Link to={`/details/${content.id}`} className="relative h-full bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105 block">
        {/* Poster Image */}
        <img
          src={content.poster}
          alt={content.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Quality Badge */}
        {content.quality && (
          <div className={`absolute top-2 left-2 ${getQualityColor(content.quality)} text-white px-2 py-1 rounded text-xs font-bold`}>
            {content.quality}
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 right-2 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-medium">
          {content.type === 'movie' ? 'Movie' : 'TV'}
        </div>

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {content.title}
          </h3>

          <div className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
            <span>{content.releaseDate}</span>
            <span>•</span>
            <span>⭐ {content.rating}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {content.genres && content.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-gray-700/80 text-gray-300 px-2 py-0.5 rounded-full text-xs"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Hover Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
              ▶ Watch
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

export default ContentCard;
