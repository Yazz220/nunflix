import React from 'react';
import styles from './SkeletonCard.module.css';

interface SkeletonCardProps {
  // The 'isLarge' prop is not currently used to change dimensions of the skeleton
  // as all cards now have a uniform poster height. It's kept for potential future use
  // if 'large' skeletons need different internal placeholder structures.
  // isLarge?: boolean; 
}

const SkeletonCard: React.FC<SkeletonCardProps> = (/*{ isLarge = false }*/) => {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.posterArea}></div>
      <div className={styles.infoArea}>
        <div className={styles.titlePlaceholder}></div>
        <div className={styles.metaPlaceholder}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;