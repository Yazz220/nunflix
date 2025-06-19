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
  ];

  const showFilters = [
    { name: 'Popular Shows', href: '/shows/popular' },
    { name: 'Top Rated', href: '/shows/top_rated' },
  ];

  const streamingFilters = [
    { name: 'Netflix', href: '/streaming/netflix' },
    { name: 'Disney+', href: '/streaming/disney+' },
    { name: 'HBO Max', href: '/streaming/hbo_max' },
    { name: 'Apple TV+', href: '/streaming/apple_tv+' },
    { name: 'Prime Video', href: '/streaming/prime_video' },
    { name: 'Hulu', href: '/streaming/hulu' },
  ];

  const discoverFilters = [
    { name: 'Trending Today', href: '/discover' },
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
