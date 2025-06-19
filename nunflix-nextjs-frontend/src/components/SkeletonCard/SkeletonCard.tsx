import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard: React.FC = () => {
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
