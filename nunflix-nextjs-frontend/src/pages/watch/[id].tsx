import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import styles from '@/styles/WatchPage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { parseTitleDetails } from '@/lib/utils';
import ServerSelector from '@/components/ServerSelector/ServerSelector';
import EpisodeList from '@/components/EpisodeList/EpisodeList';
import { FaChevronLeft, FaChevronRight, FaArrowLeft, FaInfoCircle, FaUsers, FaExpand, FaList } from 'react-icons/fa';
import React from 'react';
import ReactPlayer from 'react-player/lazy';

interface StreamSource {
  label: string;
  embed_url: string;
  provider_name?: string;
  logo_path?: string;
}

interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  name: string;
  overview: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  still_path: string | null;
  runtime?: number | null;
}

interface SeasonDetails extends Season {
  episodes: Episode[];
}

interface TitleDetails {
  id: string;
  title: string;
  media_type: 'movie' | 'tv';
  stream_sources?: StreamSource[];
  runtime?: number | null;
  episode_run_time?: number[];
  seasons?: Season[]; // From TMDB title details
  number_of_seasons?: number;
  overview: string | null;
  backdrop_path: string | null; // Added for player background
  release_date?: string;
}

interface WatchPageProps {
  titleDetails: TitleDetails | null;
  error?: string;
  initialSeasonDetails?: SeasonDetails | null;
}

const WatchPage: NextPage<WatchPageProps> = ({ titleDetails: initialTitleDetails, error: initialError, initialSeasonDetails }) => {
  const router = useRouter();
  const { id, type } = router.query; // type is 'movie' or 'tv'
  const tvId = type === 'tv' ? String(id) : null;

  const { token, isAuthenticated } = useAuthStore();
  const setGlobalError = useUIStore((state) => state.setError);

  const playerRef = useRef<any>(null);
  const [titleDetails, setTitleDetails] = useState<TitleDetails | null>(initialTitleDetails);
  const [selectedSource, setSelectedSource] = useState<StreamSource | null>(null);
  const [currentSeasonDetails, setCurrentSeasonDetails] = useState<SeasonDetails | null>(initialSeasonDetails || null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(initialSeasonDetails?.season_number || 1);
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<number>(1);
  
  const [error, setError] = useState<string | null>(initialError || null);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasWindow, setHasWindow] = useState(false);
  const progressUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const [antiSpoilerMode, setAntiSpoilerMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    const fetchStreamSources = async () => {
      if (id && type) {
        try {
          const response = await fetch(`/api/stream/${id}?type=${type}`);
          if (!response.ok) {
            throw new Error('Failed to fetch stream sources');
          }
          const data = await response.json();
          if (data.stream_sources && data.stream_sources.length > 0) {
            setTitleDetails(prev => prev ? { ...prev, stream_sources: data.stream_sources } : null);
            setSelectedSource(data.stream_sources[0]);
          }
        } catch (error) {
          console.error('Error fetching stream sources:', error);
          setGlobalError('Failed to fetch stream sources.');
        }
      }
    };

    fetchStreamSources();
  }, [id, type, setGlobalError]);

  // Fetch episodes when selectedSeasonNumber or tvId changes
  useEffect(() => {
    if (type === 'tv' && tvId && selectedSeasonNumber) {
      setIsLoadingSeason(true);
      const fetchSeasonDetails = async () => {
        try {
          const { data, error } = await supabase.from('episodes').select('*').eq('title_id', tvId).eq('season_number', selectedSeasonNumber).order('episode_number', { ascending: true });
          if (error) throw error;
          const episodes = data as Episode[];
          const season = titleDetails?.seasons?.find(s => s.season_number === selectedSeasonNumber);
          if (season) {
            setCurrentSeasonDetails({ ...season, episodes });
          }
          if (episodes && episodes.length > 0) {
            const currentEpisodeIsValid = episodes.some(ep => ep.episode_number === selectedEpisodeNumber);
            if (!currentEpisodeIsValid) {
              setSelectedEpisodeNumber(1);
            }
          } else {
            setSelectedEpisodeNumber(1);
          }
        } catch (err) {
          console.error(`Failed to fetch season ${selectedSeasonNumber} details:`, err);
          const message = (err as Error).message || `Failed to load episodes for season ${selectedSeasonNumber}.`;
          setGlobalError(message);
          setError(message);
          setCurrentSeasonDetails(null);
        } finally {
          setIsLoadingSeason(false);
        }
      };
      fetchSeasonDetails();
    }
  }, [tvId, selectedSeasonNumber, type, isAuthenticated, token, titleDetails?.seasons, selectedEpisodeNumber, setGlobalError]);


  const getEpisodeDuration = (): number | undefined => {
    if (type === 'tv' && currentSeasonDetails && currentSeasonDetails.episodes) {
      const episode = currentSeasonDetails.episodes.find(ep => ep.episode_number === selectedEpisodeNumber);
      if (episode?.runtime) return episode.runtime * 60; // Convert minutes to seconds
    }
    return undefined;
  };

  const getDuration = (): number | undefined => {
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      if (duration && duration > 0) return duration;
    }
    if (titleDetails) {
      if (titleDetails.media_type === 'movie' && titleDetails.runtime) {
        return titleDetails.runtime * 60;
      }
      if (titleDetails.media_type === 'tv') {
        return getEpisodeDuration() || (titleDetails.episode_run_time && titleDetails.episode_run_time.length > 0 ? titleDetails.episode_run_time[0] * 60 : undefined);
      }
    }
    return undefined;
  };

  const handleProgress = () => {
    if (progressUpdateRef.current) {
      clearTimeout(progressUpdateRef.current);
    }

    progressUpdateRef.current = setTimeout(async () => {
      const updateProgress = useAuthStore.getState().updateProgress;
      if (!isAuthenticated || !id || !type || !playerRef.current) return;

      const position = Math.round(playerRef.current.getCurrentTime());
      const duration = getDuration();

      if (typeof duration === 'undefined' || duration <= 0 || position <= 0) return;
      if (position < 5 || position > duration * 0.98) return;

      try {
        await updateProgress(
          Number(id),
          type === 'tv' ? selectedSeasonNumber : null,
          type === 'tv' ? selectedEpisodeNumber : null,
          position,
          Math.round(duration),
          type as 'movie' | 'tv'
        );
      } catch (err) {
        console.error('Failed to update progress:', err);
        const message = ((err as any).response?.data?.error || (err as Error).message) as string;
        setGlobalError(message);
      }
    }, 2000); // Debounce for 2 seconds
  };

  const handleSourceChange = (source: StreamSource) => {
    setSelectedSource(source);
  };

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeasonNumber(seasonNumber);
    setSelectedEpisodeNumber(1); // Reset to first episode of new season
  };

  const handleEpisodeChange = (episodeNumber: number) => {
    setSelectedEpisodeNumber(episodeNumber);
  };

  const hasNextEpisode = type === 'tv' && currentSeasonDetails && selectedEpisodeNumber < currentSeasonDetails.episodes.length;
  const hasPreviousEpisode = type === 'tv' && selectedEpisodeNumber > 1;

  const goToNextEpisode = () => {
    if (hasNextEpisode) {
      setSelectedEpisodeNumber(prev => prev + 1);
    } else if (type === 'tv' && titleDetails?.seasons) {
      const currentSeasonIndex = titleDetails.seasons.findIndex(s => s.season_number === selectedSeasonNumber);
      if (currentSeasonIndex !== -1 && currentSeasonIndex < titleDetails.seasons.length - 1) {
        const nextSeason = titleDetails.seasons[currentSeasonIndex + 1];
        setSelectedSeasonNumber(nextSeason.season_number);
        setSelectedEpisodeNumber(1);
      }
    }
  };

  const goToPreviousEpisode = () => {
    if (hasPreviousEpisode) {
      setSelectedEpisodeNumber(prev => prev - 1);
    } else if (type === 'tv' && titleDetails?.seasons) {
      const currentSeasonIndex = titleDetails.seasons.findIndex(s => s.season_number === selectedSeasonNumber);
      if (currentSeasonIndex > 0) {
        const prevSeason = titleDetails.seasons[currentSeasonIndex - 1];
        setSelectedSeasonNumber(prevSeason.season_number);
        // Set to the last episode of the previous season
        // This requires fetching episodes of the previous season first
        // For simplicity, for now, we'll go to the first episode of the previous season
        setSelectedEpisodeNumber(1);
      }
    }
  };

  const getPlayerUrl = () => {
    if (!selectedSource) return '';
    if (type === 'movie') return selectedSource.embed_url;
    
    // For TV shows, we need to find the correct episode embed URL if available, or fall back to season/show URL
    if (type === 'tv' && currentSeasonDetails) {
      // const episode = currentSeasonDetails.episodes.find(ep => ep.episode_number === selectedEpisodeNumber);
      // Assuming embed_url from stream_sources for TV shows might be for the whole series, or a placeholder
      // For actual episode-specific URLs, you might need a different TMDB API endpoint or data source.
      return selectedSource.embed_url; // For now, use the selected source's embed_url for TV
    }
    return selectedSource.embed_url; // Default for movie or if TV episode embed not found
  };

  const handlePlayerError = (e: Error) => {
    console.error('ReactPlayer Error:', e);
    setGlobalError('Playback error. Please try another source or refresh the page.');
  };

  const isTvShow = type === 'tv';

  if (error) {
    return <div className={styles.errorContainer}><p>Error: {error}</p><Link href="/">Go back home</Link></div>;
  }

  if (!titleDetails) {
    return <div className={styles.loadingContainer}>Loading...</div>; // Or a more sophisticated loading spinner
  }

  // Determine the title to display (movie title or TV show title + episode title)
  const displayTitle = isTvShow && currentSeasonDetails && selectedEpisodeNumber
    ? `${titleDetails.title} - S${selectedSeasonNumber}:E${selectedEpisodeNumber} ${currentSeasonDetails.episodes.find(ep => ep.episode_number === selectedEpisodeNumber)?.name || ''}`
    : titleDetails.title;

  return (
    <>
      <header className={styles.watchHeader}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <FaArrowLeft />
        </button>
        <h1 className={styles.title}>{displayTitle}</h1>
        <div className={styles.actionIcons}>
          <button><FaInfoCircle /></button>
          <button><FaUsers /></button>
          <button><FaExpand /></button>
          <button><FaList /></button>
        </div>
      </header>
      <div className={styles.watchContainer}>
        <div className={styles.playerColumn}>
          <div className={styles.playerWrapper}>
            {hasWindow && selectedSource ? (
              <ReactPlayer
                ref={playerRef}
                url={getPlayerUrl()}
                controls
                playing
                width="100%"
                height="100%"
                onReady={handlePlayerReady}
                onProgress={handleProgress}
                onError={handlePlayerError}
              />
            ) : (
              <div className={styles.playerPlaceholder}>Select a server to start watching.</div>
            )}
          </div>

          {isTvShow && (
            <div className={styles.episodeNavigation}>
              <button onClick={goToPreviousEpisode} disabled={!hasPreviousEpisode}>
                <FaChevronLeft /> Previous
              </button>
              <span>{`S${selectedSeasonNumber} E${selectedEpisodeNumber}`}</span>
              <button onClick={goToNextEpisode} disabled={!hasNextEpisode}>
                Next <FaChevronRight />
              </button>
            </div>
          )}

          <div className={styles.metadataStrip}>
            <div className={styles.metadataHeader}>
              <Image src={titleDetails.backdrop_path || '/placeholder-poster.png'} alt={titleDetails.title} width={100} height={150} className={styles.posterImage} />
              <div className={styles.metadataInfo}>
                <h2>{titleDetails.title}</h2>
                <p>{titleDetails.release_date?.substring(0, 4)} • {titleDetails.runtime} min</p>
              </div>
            </div>
            <div className={styles.metadataActions}>
              <button onClick={() => alert('Added to queue!')}>Add to Queue</button>
              <button onClick={() => alert('Saved!')}>Save</button>
              <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Share</button>
            </div>
          </div>
          <div className={styles.discussionSection}>
            <div className={styles.discussionHeader}>
              <h2>Discussion</h2>
              <div className={styles.discussionSort}>
                <button className={styles.active}>Newest</button>
                <button>Trending</button>
                <button>Oldest</button>
              </div>
            </div>
            <div className={styles.commentsContainer}>
              <p>Sign in to view comments</p>
            </div>
          </div>
        </div>
        <div className={styles.serversColumn}>
          {isTvShow ? (
            <EpisodeList
              seasons={titleDetails.seasons || []}
              selectedSeason={selectedSeasonNumber}
              selectedEpisode={selectedEpisodeNumber}
              onSeasonChange={handleSeasonChange}
              onEpisodeChange={handleEpisodeChange}
              episodes={currentSeasonDetails?.episodes || []}
              isLoading={isLoadingSeason}
              antiSpoilerMode={antiSpoilerMode}
              onToggleAntiSpoiler={() => setAntiSpoilerMode(!antiSpoilerMode)}
            />
          ) : (
            <ServerSelector
              sources={titleDetails.stream_sources || []}
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<WatchPageProps> = async (context) => {
  const { id, type, season: seasonQuery, episode: episodeQuery } = context.query;

  console.log('WatchPage getServerSideProps: id', id, 'type', type);

  if (!id || (type !== 'movie' && type !== 'tv')) {
    console.error('WatchPage getServerSideProps: Invalid ID or media type in query.');
    return {
      props: {
        titleDetails: null,
        error: 'Invalid ID or media type.',
      },
    };
  }

  try {
    // Fetch title details
    const { data: titleData, error: titleError } = await supabase
      .from('titles')
      .select('*, stream_sources, seasons, credits, videos, similar') // Fetch all relevant details
      .eq('id', Number(id))
      .single();

    if (titleError) {
      console.error('WatchPage getServerSideProps: Error fetching title details', titleError);
      return {
        props: {
          titleDetails: null,
          error: titleError.message || 'Failed to fetch title details.',
        },
      };
    }

    const titleDetails = parseTitleDetails(titleData);
    console.log('WatchPage getServerSideProps: Parsed titleDetails', titleDetails);

    let initialSeasonDetails: SeasonDetails | null = null;
    if (type === 'tv' && titleDetails && titleDetails.seasons && titleDetails.seasons.length > 0) {
      const seasonNumber = seasonQuery ? Number(seasonQuery) : (titleDetails.seasons.find(s => s.season_number === 1)?.season_number || titleDetails.seasons[0]?.season_number || 1);

      console.log(`WatchPage getServerSideProps: Fetching episodes for TV show ${id}, season ${seasonNumber}`);
      const { data: episodesData, error: episodesError } = await supabase
        .from('episodes')
        .select('*')
        .eq('title_id', Number(id))
        .eq('season_number', seasonNumber)
        .order('episode_number', { ascending: true });

      if (episodesError) {
        console.error(`WatchPage getServerSideProps: Error fetching episodes for season ${seasonNumber}:`, episodesError);
        // Continue without episodes for the season if there's an error
      } else {
        console.log(`WatchPage getServerSideProps: Fetched episodes for season ${seasonNumber}`, episodesData);
        const season = titleDetails.seasons.find(s => s.season_number === seasonNumber);
        if (season) {
          initialSeasonDetails = { ...season, episodes: episodesData as Episode[] };
        }
      }
    }

    return {
      props: {
        titleDetails,
        initialSeasonDetails,
      },
    };

  } catch (err) {
    console.error('WatchPage getServerSideProps: Unexpected error', err);
    return {
      props: {
        titleDetails: null,
        error: (err as Error).message || 'An unexpected error occurred.',
      },
    };
  }
};

export default WatchPage;
