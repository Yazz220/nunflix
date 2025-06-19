import React from 'react';
import Link from 'next/link';
import styles from './BurgerMenuPanel.module.css';

interface BurgerMenuPanelProps {
  onClose: () => void;
}

const BurgerMenuPanel: React.FC<BurgerMenuPanelProps> = ({ onClose }) => {
  // Placeholder data based on screenshots
  const movieFilters = [
    { name: 'Trending Movies', href: '/movies/trending' },
    { name: 'Popular Movies', href: '/movies/popular' },
    { name: 'Top Rated', href: '/movies/top_rated' },
    { name: 'Marvel Movies', href: '/movies/marvel' },
    { name: 'DC Movies', href: '/movies/dc' },
    { name: 'Paramount Movies', href: '/movies/paramount' },
    { name: 'Disney Movies', href: '/movies/disney' },
    { name: 'Most Viewed', href: '/movies/most_viewed' },
  ];

  const showFilters = [
    { name: 'Popular Shows', href: '/shows/popular' },
    { name: 'Top Rated', href: '/shows/top_rated' },
    { name: 'Netflix', href: '/shows/netflix' },
    { name: 'HBO', href: '/shows/hbo' },
    { name: 'Apple TV+', href: '/shows/apple_tv+' },
    { name: 'Prime Video', href: '/shows/prime_video' },
    { name: 'Shahid VIP', href: '/shows/shahid_vip' },
    { name: 'Starz Play', href: '/shows/starz_play' },
    { name: 'Hulu', href: '/shows/hulu' },
  ];

  const streamingFilters = [
    { name: 'Netflix', href: '/streaming/netflix' },
    { name: 'Disney+', href: '/streaming/disney+' },
    { name: 'HBO Max', href: '/streaming/hbo_max' },
    { name: 'Apple TV+', href: '/streaming/apple_tv+' },
    { name: 'Prime Video', href: '/streaming/prime_video' },
    { name: 'Shahid VIP', href: '/streaming/shahid_vip' },
    { name: 'Starz Play', href: '/streaming/starz_play' },
    { name: 'Hulu', href: '/streaming/hulu' },
  ];

  const discoverFilters = [
    { name: 'Trending Today', href: '/discover' },
    { name: 'Anime', href: '/discover?genre=anime' },
    { name: 'Top Rated', href: '/discover?sort=vote_average.desc' },
    { name: 'Most Popular', href: '/discover?sort=popularity.desc' },
    { name: 'Marvel Universe', href: '/discover?collection=marvel' },
    { name: 'DC Universe', href: '/discover?collection=dc' },
    { name: 'Most Viewed', href: '/discover?sort=views.desc' },
    { name: 'Your Watchlist', href: '/profile?tab=watchlist' },
  ];

  return (
    <div className={styles.panelOverlay} onClick={onClose}>
      <div className={styles.panelContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          ✕ {/* Unicode Close Icon */}
        </button>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Movies</h2>
                        <div className={styles.filterGrid}>
                          {movieFilters.map((filter) => (
                              <Link key={filter.name} href={filter.href} className={styles.filterItem} onClick={onClose}>
                                {filter.name}
                              </Link>
                          ))}
                        </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Shows</h2>
                        <div className={styles.filterGrid}>
                          {showFilters.map((filter) => (
                              <Link key={filter.name} href={filter.href} className={styles.filterItem} onClick={onClose}>
                                {filter.name}
                              </Link>
                          ))}
                        </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Streaming</h2>
                        <div className={styles.filterGrid}>
                          {streamingFilters.map((filter) => (
                              <Link key={filter.name} href={filter.href} className={styles.filterItem} onClick={onClose}>
                                {filter.name}
                              </Link>
                          ))}
                        </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Discover</h2>
                        <div className={styles.filterGrid}>
                          {discoverFilters.map((filter) => (
                              <Link key={filter.name} href={filter.href} className={styles.filterItem} onClick={onClose}>
                                {filter.name}
                              </Link>
                          ))}
                        </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenuPanel;
