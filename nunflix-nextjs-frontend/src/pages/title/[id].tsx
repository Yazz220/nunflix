import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { parseTitleDetails } from '@/lib/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import styles from '@/styles/DetailPage.module.css'; // We'll create this
import Link from 'next/link';
import ContentCard, { ContentCardProps } from '@/components/ContentCard/ContentCard'; // Re-added ContentCard import

// Based on research §3.2 and our backend /api/v1/title/:id response
interface Genre { id: number; name: string; }
interface Video { key: string; type: string; site: string; name?: string; }
interface CastMember { id: number; name: string; character: string; profile_path: string | null; }
interface CrewMember { id: number; name: string; job: string; }
interface StreamSource { 
  label: string; 
  embed_url: string; 
  provider_name?: string; // New: for TMDB provider name
  logo_path?: string; // New: for TMDB provider logo
}
interface SimilarItem { // Simplified from ContentCardProps for this context
  id: string | number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
}
interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  air_date: string;
  name: string;
  overview: string;
  poster_path: string | null;
}

// Interface for an episode, based on backend catalog.js
export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  runtime: number | null;
}

export interface TitleDetails {
  id: string;
  title: string;
  overview: string | null;
  genres: Genre[];
  runtime: number | null;
  episode_run_time?: number[];
  release_date: string; // or first_air_date
  status: string;
  vote_average: number;
  vote_count: number;
  imdb_id: string | null;
  videos: Video[];
  credits: { cast: CastMember[]; crew: CrewMember[]; };
  images: { poster_path: string | null; backdrop_path: string | null; }; // from research
  poster_path: string | null; // from our mapToCardSchema consistency
  backdrop_path: string | null; // from our mapToCardSchema consistency
  stream_sources: StreamSource[];
  similar: SimilarItem[];
  media_type: 'movie' | 'tv';
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
}

interface TitleDetailPageProps {
  details: TitleDetails | null;
  error?: string;
  initialEpisodes?: Episode[] | null;
  initialSeasonNumber?: number | null;
}

const TMDB_IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const TMDB_IMAGE_BASE_URL_W500 = 'https://image.tmdb.org/t/p/w500';

const TitleDetailPage: NextPage<TitleDetailPageProps> = ({ details, error, initialEpisodes, initialSeasonNumber }) => {
  const router = useRouter();
  const { id, type: queryType } = router.query; // Get id and type from URL

  // Add console logs for debugging the 'Play' button href
  useEffect(() => {
    if (details) {
      console.log('TitleDetailPage details.id:', details.id);
      console.log('TitleDetailPage details.media_type:', details.media_type);
      const playButtonHref = `/watch/${details.id}?type=${details.media_type}`;
      console.log('TitleDetailPage Play Button href:', playButtonHref);
    }
  }, [details]);

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number | null>(initialSeasonNumber || null);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState<Episode[] | null>(initialEpisodes || null);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState<boolean>(false);

  // Fetch episodes when selectedSeasonNumber or TV show ID changes
  useEffect(() => {
    if (selectedSeasonNumber === initialSeasonNumber) {
      return;
    }

    if (details && details.media_type === 'tv' && selectedSeasonNumber !== null && details.id) {
      const fetchEpisodes = async () => {
        setIsLoadingEpisodes(true);
        setCurrentSeasonEpisodes(null); // Clear previous episodes
        try {
          const { data: episodes, error } = await supabase
            .from('episodes')
            .select('*')
            .eq('title_id', details.id)
            .eq('season_number', selectedSeasonNumber)
            .order('episode_number', { ascending: true });

          if (error) {
            throw error;
          }
          
          setCurrentSeasonEpisodes(episodes || []);
        } catch (err) {
          console.error(`Failed to fetch episodes for season ${selectedSeasonNumber}:`, err);
          setCurrentSeasonEpisodes([]); // Set to empty array on error to avoid infinite loading
        } finally {
          setIsLoadingEpisodes(false);
        }
      };
      fetchEpisodes();
    }
  }, [selectedSeasonNumber, details, initialSeasonNumber]);


  if (error) {
    return <div className={styles.pageContainer}><p>Error loading details: {error}</p></div>;
  }

  if (!details) {
    return <div className={styles.pageContainer}><p>Loading details...</p></div>; // Or a skeleton loader
  }

  const backdropUrl = details.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL_ORIGINAL}${details.backdrop_path}`
    : details.poster_path ? `${TMDB_IMAGE_BASE_URL_ORIGINAL}${details.poster_path}` : '/placeholder-backdrop.png';
  
  const posterUrl = details.poster_path
    ? `${TMDB_IMAGE_BASE_URL_W500}${details.poster_path}`
    : '/placeholder-poster.png';

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>{details.title} - Nunflix</title>
        <meta name="description" content={details.overview || `Details for ${details.title}`} />
      </Head>
      <header
        className={styles.heroSection}
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 70%, #0a0a0a 100%), url(${backdropUrl})`}}
      >
        <div className={styles.heroContent}>
          <div className={styles.posterImageWrapper}>
            <Image src={posterUrl} alt={`${details.title} poster`} width={300} height={450} className={styles.posterImage} unoptimized={!details.poster_path}/>
          </div>
          <div className={styles.heroInfo}>
            <h1 className={styles.title}>{details.title}</h1>
            <div className={styles.metaTags}>
              <span>{details.release_date?.substring(0, 4)}</span>
              {details.runtime ? <span>{details.runtime} min</span> : null}
              {details.media_type === 'tv' && details.number_of_seasons ? <span>{details.number_of_seasons} Season(s)</span> : null}
              {details.genres.slice(0, 3).map((g: any) => <span key={g.id} className={styles.genreTag}>{g.name}</span>)}
              <span className={styles.parentalGuide}>Parents Guide</span>
            </div>
            <div className={styles.rating}>
              <span className={styles.ratingValue}>{details.vote_average?.toFixed(1)}</span>
            </div>
            <p className={styles.overview}>{details.overview}</p>
            <div className={styles.additionalInfo}>
              {/* <p>Rating: TV-14</p> */}
              {/* <Image src="https://www.themoviedb.org/t/p/h30/ifhbI6sHj2c7wWadKx3h4Yc9rvA.png" alt="Life OK" width={50} height={20} /> */}
              {/* <p>Status: {details.status}</p> */}
              {/* <p>Release Date: {details.release_date}</p> */}
            </div>
            <div className={styles.actions}>
              {details.stream_sources && details.stream_sources.length > 0 && (
                <div className={styles.watchProviders}>
                  {/* <h3>Available on:</h3> */}
                  {/* {details.stream_sources.map((source, index) => (
                    // Display provider_name and logo_path if available, otherwise fallback to label
                    <span key={index} className={styles.providerTag}>
                      {source.logo_path && (
                        <Image 
                          src={`https://image.tmdb.org/t/p/w500${source.logo_path}`}
                          alt={source.provider_name || source.label || 'Provider Logo'}
                          width={24} 
                          height={24} 
                          className={styles.providerLogo}
                        />
                      )}
                      {source.provider_name || source.label}
                    </span>
                  ))} */}
                </div>
              )}
              {details.stream_sources && details.stream_sources.length > 0 && (
                <Link href={`/watch/${details.id}?type=${details.media_type}`} className={`${styles.actionButton} ${styles.playButton}`}> 
                  ▶ Play
                </Link>
              )}
              {/* Add to Watchlist Button Placeholder */}
            </div>
          </div>
        </div>
      </header>
      <main className={styles.mainDetailContent}>
        {details.credits && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Cast</h2>
            <div className={styles.castGrid}>
              {details.credits.cast.slice(0, 12).map((member: CastMember) => (
                <div key={member.id} className={styles.castMember}>
                  <Image
                    src={member.profile_path ? `${TMDB_IMAGE_BASE_URL_W500}${member.profile_path}` : '/placeholder-poster.png'}
                    alt={member.name}
                    width={100} height={150}
                    className={styles.castImage}
                    unoptimized={!member.profile_path}
                  />
                  <p className={styles.castName}>{member.name}</p>
                  <p className={styles.castCharacter}>{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos/Trailers Section Placeholder */}
        {details.videos && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Trailers & Videos</h2>
            <div className={styles.videosGrid}>
              {details.videos.filter((v: Video) => v.site === "YouTube" && v.type === "Trailer").slice(0, 3).map((video: Video) => (
                <div key={video.key} className={styles.videoItem}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name || 'Trailer'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.videoIframe}
                  ></iframe>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Seasons/Episodes for TV Shows Placeholder */}
        {details.media_type === 'tv' && details.seasons && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Seasons</h2>
            <div className={styles.seasonSelector}>
              {details.seasons.map((season: Season) => (
                <button
                  key={season.id}
                  className={`${styles.seasonTab} ${selectedSeasonNumber === season.season_number ? styles.activeSeasonTab : ''}`}
                  onClick={() => setSelectedSeasonNumber(season.season_number)}
                >
                  {season.name || `Season ${season.season_number}`}
                </button>
              ))}
            </div>

            {isLoadingEpisodes && <p>Loading episodes...</p>}
            
            {!isLoadingEpisodes && currentSeasonEpisodes && currentSeasonEpisodes.length > 0 && (
              <div className={styles.episodesGrid}>
                {currentSeasonEpisodes.map(episode => (
                  <div key={episode.id} className={styles.episodeCard}> {/* Placeholder for EpisodeCard component */}
                    <Link
                      href={`/watch/${details.id}?type=tv&season=${selectedSeasonNumber}&episode=${episode.episode_number}`}
                      legacyBehavior>
                      {/* Basic Episode Info - to be replaced by EpisodeCard component */}
                      <div className={styles.episodeThumbnailPlaceholder}>
                        {episode.still_path ? (
                           <Image src={`${TMDB_IMAGE_BASE_URL_W500}${episode.still_path}`} alt={episode.name || `Episode ${episode.episode_number}`} width={300} height={169} style={{ objectFit: 'cover', borderRadius: '4px'}} unoptimized />
                        ) : (
                          <div className={styles.episodeNoImage}>No Image</div>
                        )}
                      </div>
                      <h5 className={styles.episodeTitle}>E{episode.episode_number}: {episode.name}</h5>
                      <p className={styles.episodeOverview}>{episode.overview?.substring(0, 100)}...</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {!isLoadingEpisodes && currentSeasonEpisodes && currentSeasonEpisodes.length === 0 && (
              <p>No episodes found for this season.</p>
            )}
          </section>
        )}

        {/* Similar Content Placeholder */}
        {details.similar && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Similar Titles</h2>
            <div className={styles.similarGrid}>
              {details.similar.map((item: SimilarItem) => (
                <Link
                  key={item.id}
                  href={`/title/${item.id}?type=${item.media_type}`}
                  className={styles.similarCard}
                  legacyBehavior>
                    <Image
                        src={item.poster_path ? `${TMDB_IMAGE_BASE_URL_W500}${item.poster_path}` : '/placeholder-poster.png'}
                        alt={item.title}
                        width={150} height={225}
                        className={styles.similarPoster}
                        unoptimized={!item.poster_path}
                    />
                    <p className={styles.similarTitle}>{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all movie and TV show IDs from your Supabase database
  const { data, error } = await supabase
    .from('titles')
    .select('id, media_type');

  if (error) {
    console.error('Error fetching paths:', error);
    return { paths: [], fallback: 'blocking' };
  }

  const paths = data.map((title) => ({
    params: { id: String(title.id) }, // Only include id in params
  }));

  return {
    paths,
    fallback: 'blocking', // or true
  };
};

export const getStaticProps: GetStaticProps<TitleDetailPageProps> = async (context) => {
  const { id } = context.params as { id: string };

  if (!id) {
    return { notFound: true };
  }

  try {
    const res = await fetch(`http://localhost:3000/api/v1/title/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch title details');
    }
    const details = await res.json();

    let initialEpisodes: Episode[] | null = null;
    let initialSeasonNumber: number | null = null;

    if (details.media_type === 'tv' && details.seasons && details.seasons.length > 0) {
      const firstSeason = details.seasons.find((s: any) => s.season_number === 1) || details.seasons[0];
      if (firstSeason) {
        initialSeasonNumber = firstSeason.season_number;
        const { data: episodes, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('title_id', id)
          .eq('season_number', firstSeason.season_number)
          .order('episode_number', { ascending: true });

        if (episodesError) {
          console.error(`Failed to fetch initial episodes for season ${firstSeason.season_number}:`, episodesError);
        }
        initialEpisodes = episodes || [];
      }
    }

    return {
      props: {
        details,
        initialEpisodes,
        initialSeasonNumber,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (err: any) {
    console.error(`Error in getStaticProps for ID ${id}:`, err);
    return {
      props: {
        details: null,
        error: 'Failed to load title details.',
      },
      revalidate: 60,
    };
  }
};

export default TitleDetailPage;