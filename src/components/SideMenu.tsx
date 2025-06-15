import React from 'react';
import { Link } from 'react-router-dom';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const menuItems = {
    Movies: [
      { name: 'Trending Movies', path: '/movies?category=trending' },
      { name: 'Popular Movies', path: '/movies?category=popular' },
      { name: 'Top Rated', path: '/movies?category=top-rated' },
      { name: 'Marvel Movies', path: '/movies?studio=marvel' },
      { name: 'DC Movies', path: '/movies?studio=dc' },
      { name: 'Paramount', path: '/movies?studio=paramount' },
      { name: 'Disney', path: '/movies?studio=disney' },
      { name: 'Most Viewed', path: '/movies?sort=most-viewed' },
    ],
    Shows: [
      { name: 'Popular Shows', path: '/tv?category=popular' },
      { name: 'Netflix Shows', path: '/tv?studio=netflix' },
      { name: 'HBO Shows', path: '/tv?studio=hbo' },
      { name: 'Apple TV+', path: '/tv?studio=apple-tv' },
      { name: 'Prime Video', path: '/tv?studio=prime-video' },
      { name: 'Shahid VIP', path: '/tv?studio=shahid-vip' },
      { name: 'Starz Play', path: '/tv?studio=starz-play' },
      { name: 'Hulu', path: '/tv?studio=hulu' },
    ],
    Streaming: [
      { name: 'Netflix', path: '/streaming?provider=netflix' },
      { name: 'HBO Max', path: '/streaming?provider=hbo-max' },
      { name: 'Apple TV+', path: '/streaming?provider=apple-tv' },
      { name: 'Disney+', path: '/streaming?provider=disney' },
      { name: 'Prime Video', path: '/streaming?provider=prime-video' },
      { name: 'Shahid VIP', path: '/streaming?provider=shahid-vip' },
      { name: 'Starz Play', path: '/streaming?provider=starz-play' },
      { name: 'Hulu', path: '/streaming?provider=hulu' },
    ],
    Discover: [
      { name: 'Trending Today', path: '/discover?sort=trending-today' },
      { name: 'Anime', path: '/discover?genre=anime' },
      { name: 'Top Rated', path: '/discover?sort=top-rated' },
      { name: 'Most Popular', path: '/discover?sort=most-popular' },
      { name: 'Marvel Universe', path: '/discover?universe=marvel' },
      { name: 'DC Universe', path: '/discover?universe=dc' },
      { name: 'Most Viewed', path: '/discover?sort=most-viewed' },
      { name: 'Your Watchlist', path: '/discover?watchlist=true' },
      { name: 'Watch History', path: '/watch-history' },
      { name: 'My List', path: '/my-list' },
    ],
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-900 shadow-lg z-50 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-64px)] scrollbar-hide">
          {Object.entries(menuItems).map(([section, items]) => (
            <div key={section} className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                {section === 'Movies' && '🎞️ '}
                {section === 'Shows' && '📺 '}
                {section === 'Streaming' && '📡 '}
                {section === 'Discover' && '✨ '}
                {section}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className="block bg-gray-800 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SideMenu; 