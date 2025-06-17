import React, { useState } from 'react';
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
  onSelectSource: (source: StreamSource) => void;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({ sources, selectedSource, onSelectSource }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectSource = (source: StreamSource) => {
    onSelectSource(source);
    setIsOpen(false);
  };

  return (
    <div className={styles.serverSelector}>
      <button className={styles.changeServerButton} onClick={() => setIsOpen(!isOpen)}>
        <FaCog />
        <span>Change Server</span>
        <span>{selectedSource?.provider_name || selectedSource?.label}</span>
      </button>
      {isOpen && (
        <ul className={styles.serverList}>
          {sources.map((source) => (
            <li
              key={source.label}
              className={selectedSource?.label === source.label ? styles.active : ''}
              onClick={() => handleSelectSource(source)}
            >
              {source.provider_name || source.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServerSelector;