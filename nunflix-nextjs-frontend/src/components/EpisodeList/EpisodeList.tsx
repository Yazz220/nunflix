import React from 'react';
import styles from './EpisodeList.module.css';
import Image from 'next/image';
import { Episode } from '@/pages/watch/[id]';

interface EpisodeListProps {
  episodes: Episode[];
  selectedEpisode: number;
  onSelectEpisode: (episodeNumber: number) => void;
  antiSpoilerMode: boolean;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, selectedEpisode, onSelectEpisode, antiSpoilerMode }) => {
  return (
    <div className={styles.episodeList}>
      <h3>Episodes</h3>
      <ul>
        {episodes.map((episode) => (
          <li
            key={episode.episode_number}
            className={selectedEpisode === episode.episode_number ? styles.active : ''}
            onClick={() => onSelectEpisode(episode.episode_number)}
          >
            <div className={styles.episodeThumbnail}>
              {antiSpoilerMode ? (
                <div className={styles.placeholderThumbnail} />
              ) : (
                episode.still_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={`${episode.name} still`}
                    width={160}
                    height={90}
                    unoptimized
                  />
                ) : (
                  <div className={styles.placeholderThumbnail} />
                )
              )}
              <span className={styles.episodeNumber}>{episode.episode_number}</span>
            </div>
            <div className={styles.episodeInfo}>
              {antiSpoilerMode ? (
                <p className={styles.spoilerHidden}>Details hidden to avoid spoilers</p>
              ) : (
                <>
                  <p className={styles.episodeTitle}>{episode.name}</p>
                  <p className={styles.episodeRuntime}>{episode.runtime ? `${episode.runtime} min` : ''}</p>
                  <p className={styles.episodeOverview}>{episode.overview}</p>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodeList;