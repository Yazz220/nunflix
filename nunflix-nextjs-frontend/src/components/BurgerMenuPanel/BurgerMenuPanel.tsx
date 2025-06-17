import React from 'react';
import Link from 'next/link';
import styles from './BurgerMenuPanel.module.css';

interface BurgerMenuPanelProps {
  onClose: () => void;
}

const BurgerMenuPanel: React.FC<BurgerMenuPanelProps> = ({ onClose }) => {
  // Placeholder data based on screenshots
  const movieFilters = [
    { name: 'Trending Movies', href: '#' },
    { name: 'Popular Movies', href: '#' },
    { name: 'Top Rated', href: '#' },
    { name: 'Marvel Movies', href: '#' },
    { name: 'DC Movies', href: '#' },
    { name: 'Paramount', href: '#' },
    { name: 'Disney', href: '#' },
    { name: 'Most Viewed', href: '#' },
  ];

  const showFilters = [
    { name: 'Popular Shows', href: '#' },
    { name: 'Netflix Shows', href: '#' },
    { name: 'HBO Shows', href: '#' },
    { name: 'Apple TV+', href: '#' },
    { name: 'Prime Video', href: '#' },
    { name: 'Shahid VIP', href: '#' },
    { name: 'Starz Play', href: '#' },
    { name: 'Hulu', href: '#' },
  ];

  const streamingFilters = [
    { name: 'Netflix', href: '#' },
    { name: 'Disney+', href: '#' },
    { name: 'HBO Max', href: '#' },
    { name: 'Apple TV+', href: '#' },
    { name: 'Prime Video', href: '#' },
    { name: 'Shahid VIP', href: '#' },
    { name: 'Starz Play', href: '#' },
    { name: 'Hulu', href: '#' },
  ];

  const discoverFilters = [
    { name: 'Trending Today', href: '#' },
    { name: 'Anime', href: '#' },
    { name: 'Top Rated', href: '#' },
    { name: 'Most Popular', href: '#' },
    { name: 'Marvel Universe', href: '#' },
    { name: 'DC Universe', href: '#' },
    { name: 'Most Viewed', href: '#' },
    { name: 'Your Watchlist', href: '#' },
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
              <Link key={filter.name} href={filter.href} legacyBehavior>
                <span className={styles.filterItem} onClick={onClose}>{filter.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Shows</h2>
          <div className={styles.filterGrid}>
            {showFilters.map((filter) => (
              <Link key={filter.name} href={filter.href} legacyBehavior>
                <span className={styles.filterItem} onClick={onClose}>{filter.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Streaming</h2>
          <div className={styles.filterGrid}>
            {streamingFilters.map((filter) => (
              <Link key={filter.name} href={filter.href} legacyBehavior>
                <span className={styles.filterItem} onClick={onClose}>{filter.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Discover</h2>
          <div className={styles.filterGrid}>
            {discoverFilters.map((filter) => (
              <Link key={filter.name} href={filter.href} legacyBehavior>
                <span className={styles.filterItem} onClick={onClose}>{filter.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenuPanel;