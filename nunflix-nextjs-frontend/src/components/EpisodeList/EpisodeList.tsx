import React from 'react';
import styles from './EpisodeList.module.css';
import Image from 'next/image';
import { Episode } from '@/pages/watch/[id]';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Season {
  id: number;
  season_number: number;
  name: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  seasons: Season[];
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
  isLoading: boolean;
  antiSpoilerMode: boolean;
  onToggleAntiSpoiler: () => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
  isLoading,
  antiSpoilerMode,
  onToggleAntiSpoiler,
}) => {
  const currentSeasonIndex = seasons.findIndex(s => s.season_number === selectedSeason);

  const handlePreviousSeason = () => {
    if (currentSeasonIndex > 0) {
      onSeasonChange(seasons[currentSeasonIndex - 1].season_number);
    }
  };

  const handleNextSeason = () => {
    if (currentSeasonIndex < seasons.length - 1) {
      onSeasonChange(seasons[currentSeasonIndex + 1].season_number);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.seasonSelector}>
        <button onClick={handlePreviousSeason} disabled={currentSeasonIndex <= 0}>
          <FaChevronLeft />
        </button>
        <span>Season {selectedSeason}</span>
        <button onClick={handleNextSeason} disabled={currentSeasonIndex >= seasons.length - 1}>
          <FaChevronRight />
        </button>
      </div>
      <div className={styles.antiSpoiler}>
        <label>
          <input type="checkbox" checked={antiSpoilerMode} onChange={onToggleAntiSpoiler} />
          Anti-Spoiler Mode
        </label>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Loading episodes...</div>
      ) : (
        <ul className={styles.episodeList}>
          {episodes.map((episode) => (
            <li
              key={episode.id}
              className={`${styles.episodeItem} ${selectedEpisode === episode.episode_number ? styles.active : ''}`}
              onClick={() => onEpisodeChange(episode.episode_number)}
            >
              <div className={styles.thumbnail}>
                {antiSpoilerMode || !episode.still_path ? (
                  <div className={styles.placeholder} />
                ) : (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                    alt={episode.name}
                    width={120}
                    height={68}
                    className={styles.image}
                  />
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.episodeNumber}>{`E${episode.episode_number}`}</span>
                {!antiSpoilerMode && <p className={styles.episodeName}>{episode.name}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EpisodeList;
