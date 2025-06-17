'use client';

import React, { useRef, useState, useEffect } from 'react';
import ContentCard, { ContentCardProps } from '../ContentCard/ContentCard';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import styles from './Carousel.module.css';

interface CarouselProps {
  title: string;
  items: ContentCardProps[] | null | undefined; // Allow items to be null or undefined during loading
  isLoading?: boolean;
  skeletonCount?: number;
  isLargeRow?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  title,
  items,
  isLoading = false,
  skeletonCount = 5,
  isLargeRow = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<F>): void => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
  };

  const checkArrowsVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      const debouncedCheck = debounce(checkArrowsVisibility, 100);
      // Initial check
      checkArrowsVisibility();
      // Check on scroll
      currentRef.addEventListener('scroll', debouncedCheck);
      // Check on resize (if window resizes, clientWidth might change)
      window.addEventListener('resize', debouncedCheck);

      return () => {
        currentRef.removeEventListener('scroll', debouncedCheck);
        window.removeEventListener('resize', debouncedCheck);
      };
    }
  }, [items, isLoading]); // Re-check if items or loading state changes, affecting scrollWidth

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll by 80% of visible width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.row}>
        <div className={styles.rowHeader}>
          <h2 className={styles.rowTitle}>{title}</h2>
          {/* Placeholder for arrow group during loading if needed, or hide */}
        </div>
        <div className={styles.row_posters_loading}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.carouselItemWrapper}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={styles.row}>
         <div className={styles.rowHeader}>
          <h2 className={styles.rowTitle}>{title}</h2>
        </div>
        <p className={styles.emptyMessage}>No items to display in this category yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>{title}</h2>
        <div className={styles.arrowButtonGroup}>
          {showLeftArrow && (
            <button
              className={`${styles.arrowButton} ${styles.leftArrowButton}`}
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              ❮
            </button>
          )}
          {showRightArrow && (
            <button
              className={`${styles.arrowButton} ${styles.rightArrowButton}`}
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              ❯
            </button>
          )}
        </div>
      </div>
      <div className={styles.row_posters} ref={scrollRef}>
        {items.map((item) => {
          if (!item || !item.id) return null;

          return (
            <div key={item.id} className={styles.carouselItem}>
              <ContentCard
                id={item.id}
                title={item.title}
                poster_path={item.poster_path}
                media_type={item.media_type}
                release_date={item.release_date}
                vote_average={item.vote_average}
                watch_providers={item.watch_providers}
                isLarge={isLargeRow}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;