import React from 'react';
import Image from 'next/image';
import styles from './ServerSelector.module.css';
import { FaCog } from 'react-icons/fa';

interface StreamSource {
  label: string;
  embed_url: string;
  provider_name?: string;
  logo_path?: string;
}

interface ServerSelectorProps {
  sources: StreamSource[];
  selectedSource: StreamSource | null;
  onSourceChange: (source: StreamSource) => void;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({ sources, selectedSource, onSourceChange }) => {
  return (
    <div className={styles.serverSelectorPanel}>
      <div className={styles.serverSelectorHeader}>
        <FaCog />
        <h3>Available Servers</h3>
      </div>
      <ul className={styles.serverList}>
        {sources.map((source) => (
          <li key={source.label}>
            <button
              className={`${styles.serverButton} ${selectedSource?.label === source.label ? styles.active : ''}`}
              onClick={() => onSourceChange(source)}
            >
              <div className={styles.serverInfo}>
                {source.logo_path ? (
                  <Image src={`https://image.tmdb.org/t/p/w92${source.logo_path}`} alt={source.provider_name || 'Provider logo'} width={40} height={40} className={styles.providerLogo} />
                ) : (
                  <span>{source.provider_name || source.label}</span>
                )}
              </div>
              {selectedSource?.label === source.label && (
                <span className={styles.activeLabel}>Currently Active</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerSelector;
