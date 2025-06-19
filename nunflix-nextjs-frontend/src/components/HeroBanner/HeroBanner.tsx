'use client';

import React from 'react';
import Link from 'next/link';
import styles from './HeroBanner.module.css';

export interface HeroBannerProps {
  id: number | string;
  title: string;
  overview?: string; // Make overview optional as it might not always be in card data
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  // We might add trailer_key later if we want a play trailer button
}

const TMDB_IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';

const HeroBanner: React.FC<HeroBannerProps> = ({
  id,
  title,
  overview,
  backdrop_path,
  media_type,
}) => {
  const truncateOverview = (str: string | undefined, n: number) => {
    return str && str.length > n ? str.substring(0, n - 1) + '...' : str;
  };

  const backgroundStyle = backdrop_path
    ? { backgroundImage: `url(${TMDB_IMAGE_BASE_URL_ORIGINAL}${backdrop_path})` }
    : { backgroundColor: '#222' }; // Fallback background

  return (
    <header
      className={styles.banner}
      style={backgroundStyle}
    >
      <div className={styles.banner_content}>
        <h1 className={styles.banner_title}>{title}</h1>
        <div className={styles.banner_buttons}>
          <Link href={`/watch/${id}?type=${media_type}`} className={styles.banner_button}>
            Play
          </Link>
          <Link href={`/title/${id}?type=${media_type}`} className={styles.banner_button}>
            More Info
          </Link>
        </div>
        {overview && (
          <p className={styles.banner_description}>
            {truncateOverview(overview, 150)}
          </p>
        )}
      </div>
      <div className={styles.banner_fadeBottom}></div>
    </header>
  );
};

export default HeroBanner;
