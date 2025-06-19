'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, FavoriteItem } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore'; // Import useUIStore
import { supabase } from '@/lib/supabaseClient';
import styles from './ContentCard.module.css';

// Based on our defined Card Schema in the plan
export interface ContentCardProps {
  id: number | string; // TMDB ID
  title: string;
  poster_path: string | null;
  poster?: string;
  backdrop_path?: string | null;
  overview?: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  vote_average?: number;
  progress?: number; // Progress percentage (0 to 1)
  progress_seconds?: number; // Watched duration
  duration_seconds?: number; // Total duration
  watch_providers?: { provider_name: string; logo_path: string }[]; // New field
  isLarge?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  poster_path,
  media_type,
  release_date,
  vote_average,
  progress,
  isLarge = false,
  // progress_seconds and duration_seconds are available if needed for display text
}) => {
  const {
    isAuthenticated,
    addFavorite,
    removeFavorite,
    addToWatchlist, // Added
    removeFromWatchlist, // Added
    user
  } = useAuthStore();
  const setGlobalError = useUIStore((state) => state.setError);
  
  const numericId = Number(id);

  // Get the full lists at the top level of the component
  const storeFavorites = useAuthStore(state => state.favorites);
  const storeWatchlist = useAuthStore(state => state.watchlist);

  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);

  const isFavorited = isAuthenticated && storeFavorites.some(fav => fav.id === numericId);
  const isOnWatchlist = isAuthenticated && storeWatchlist.some(wl => wl.id === numericId);


  const handleToggle = async (e: React.MouseEvent, type: 'favorite' | 'watchlist') => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      setGlobalError(`Please login to add items to your ${type}s.`);
      return;
    }

    if (!media_type) {
      setGlobalError('Cannot perform this action: media type is missing.');
      return;
    }

    if (type === 'favorite') {
      if (isLoadingFavorite) return;
      setIsLoadingFavorite(true);
    } else {
      if (isLoadingWatchlist) return;
      setIsLoadingWatchlist(true);
    }

    const isCurrentlySet = type === 'favorite' ? isFavorited : isOnWatchlist;
    const tableName = type === 'favorite' ? 'favorites' : 'watchlist';
    const { add, remove } = type === 'favorite'
      ? { add: addFavorite, remove: removeFavorite }
      : { add: addToWatchlist, remove: removeFromWatchlist };

    const item: FavoriteItem = {
      id: numericId,
      type: media_type,
      title: title,
      poster_path: poster_path ?? undefined,
    };

    try {
      if (!user) throw new Error('User not authenticated');
      if (isCurrentlySet) {
        const { error } = await supabase.from(tableName).delete().match({ user_id: user.id, title_id: numericId });
        if (error) throw error;
        remove(numericId);
      } else {
        const { error } = await supabase.from(tableName).insert({ user_id: user.id, title_id: numericId });
        if (error) throw error;
        add(item);
      }
    } catch (error) {
      console.error(`Failed to toggle ${type}:`, error);
      const message = (error as Error).message || `Failed to update ${type}. Please try again.`;
      setGlobalError(message);
    } finally {
      if (type === 'favorite') {
        setIsLoadingFavorite(false);
      } else {
        setIsLoadingWatchlist(false);
      }
    }
  };

  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://placehold.co/200x300.png';

  return (
    <Link href={`/title/${numericId}?type=${media_type || 'movie'}`} className={`${styles.card} ${isLarge ? styles.cardLarge : ''}`}>
        <div className={styles.actionButtonsWrapper}> {/* Wrapper for action buttons */}
          <button
            className={`${styles.actionButton} ${styles.favoriteButton} ${isFavorited ? styles.favoriteButtonActive : ''}`}
          onClick={(e) => handleToggle(e, 'favorite')}
          disabled={isLoadingFavorite || !isAuthenticated}
          aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorited ? '❤️' : '♡'}
        </button>
        <button // New Watchlist Button
          className={`${styles.actionButton} ${styles.watchlistButton} ${isOnWatchlist ? styles.watchlistButtonActive : ''}`}
          onClick={(e) => handleToggle(e, 'watchlist')}
          disabled={isLoadingWatchlist || !isAuthenticated}
          aria-label={isOnWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          title={isOnWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {/* Using a simple plus/check for now, could be icons */}
          {isOnWatchlist ? '✓' : '+'}
        </button>
        </div>
        <div className={styles.cardClickableArea}>
            <div className={styles.posterWrapper}>
              <Image
                src={imageUrl}
              alt={title || 'Content poster'}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
              style={{ objectFit: 'cover' }}
              className={styles.posterImage}
              unoptimized={!poster_path}
              priority={false}
            />
            {progress !== undefined && progress > 0 && progress < 1 && (
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.titleWrapper}>
              <h3 className={styles.title}>{title}</h3>
            </div>
            <div className={styles.meta}>
              <span className={styles.year}>{year}</span>
              {vote_average && vote_average > 0 ? (
                <span className={styles.rating}>
                  ⭐ {vote_average.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
    </Link>
  );
};

export default ContentCard;
