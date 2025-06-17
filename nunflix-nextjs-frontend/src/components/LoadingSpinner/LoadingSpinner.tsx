import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: number; // size in pixels
  color?: string;
  fullPage?: boolean; // If true, centers spinner on the whole page
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 50, color = '#E50914', fullPage = false }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: 'transparent', // Creates the spinning effect
  };

  if (fullPage) {
    return (
      <div className={styles.fullPageOverlay}>
        <div className={styles.spinner} style={spinnerStyle}></div>
      </div>
    );
  }

  return <div className={styles.spinner} style={spinnerStyle}></div>;
};

export default LoadingSpinner;