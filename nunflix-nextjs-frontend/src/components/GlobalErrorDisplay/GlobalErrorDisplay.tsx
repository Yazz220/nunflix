'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import styles from './GlobalErrorDisplay.module.css';

const GlobalErrorDisplay: React.FC = () => {
  const globalError = useUIStore((state) => state.globalError);
  const setError = useUIStore((state) => state.setError);

  const handleClose = () => {
    setError(null); // Clear the error
  };

  // Optional: Auto-dismiss error after some time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (globalError) {
      timer = setTimeout(() => {
        setError(null);
      }, 7000); // Auto-dismiss after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [globalError, setError]);

  if (!globalError) {
    return null;
  }

  return (
    <div className={styles.errorOverlay}>
      <div className={styles.errorContent}>
        <p>{globalError}</p>
        <button onClick={handleClose} className={styles.closeButton}>
          &times; {/* Unicode multiplication sign for 'x' */}
        </button>
      </div>
    </div>
  );
};

export default GlobalErrorDisplay;