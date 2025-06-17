import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router'; // Import useRouter
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { supabase } from '@/lib/supabaseClient';
import ContentCard, { ContentCardProps } from '@/components/ContentCard/ContentCard';
import SkeletonCard from '@/components/SkeletonCard/SkeletonCard'; // Import SkeletonCard
import styles from '@/styles/ExplorePage.module.css';

interface DiscoverResult {
  page: number;
  results: ContentCardProps[];
  total_pages: number;
  total_results: number;
}

interface TVShowsPageProps {
  tvShowsData: DiscoverResult | null;
  error?: string;
  genres: string[]; // Add genres to props
  initialGenre?: string; // Add initialGenre to props
  initialSort?: string; // Add initialSort to props
}

const TVShowsPage: NextPage<TVShowsPageProps> = ({ tvShowsData, error, genres, initialGenre = '', initialSort = 'vote_average.desc' }) => {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [sortOrder, setSortOrder] = useState<string>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(1); // For pagination

  // Effect to update URL and refetch data when filters/sort change
  useEffect(() => {
    const query: Record<string, string> = {};
    if (selectedGenre) query.genre = selectedGenre;
    if (sortOrder) query.sort = sortOrder;
    query.page = String(currentPage);

    router.push({
      pathname: router.pathname,
      query: query,
    }, undefined, { shallow: true }); // shallow: true to avoid full page reload
  }, [selectedGenre, sortOrder, currentPage]);

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
    setCurrentPage(1); // Reset page on sort change
  };

  if (error) {
    return <p>Error loading TV shows: {error}</p>;
  }

  if (!tvShowsData) { // If no data and no error, show skeletons
    const skeletonCount = 12; // Number of skeletons to show
    return (
      <div className={styles.explorePageContainer}>
        <Head>
          <title>Loading TV Shows - Nunflix</title>
        </Head>
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>All TV Shows</h1>
          <div className={styles.grid}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={`skeleton-tv-${index}`} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!tvShowsData.results || tvShowsData.results.length === 0) {
    return (
        <div className={styles.explorePageContainer}>
            <Head><title>TV Shows - Nunflix</title></Head>
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>All TV Shows</h1>
                <p>No TV shows found.</p>
            </main>
        </div>
    );
  }

  return (
    <div className={styles.explorePageContainer}>
      <Head>
        <title>TV Shows - Nunflix</title>
        <meta name="description" content="Browse all TV shows on Nunflix" />
      </Head>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>All TV Shows</h1>
        <div className={styles.filterSortContainer}> {/* New container for filters and sort */}
          <div className={styles.filterGroup}>
            <label htmlFor="genre-select" className={styles.filterLabel}>Genre:</label>
            <select
              id="genre-select"
              className={styles.filterDropdown}
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="sort-select" className={styles.filterLabel}>Sort By:</label>
            <select
              id="sort-select"
              className={styles.filterDropdown}
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="vote_average.desc">Popularity (High to Low)</option>
              <option value="vote_average.asc">Popularity (Low to High)</option>
              <option value="release_date.desc">First Air Date (Newest First)</option>
              <option value="release_date.asc">First Air Date (Oldest First)</option>
              <option value="title.asc">Title (A-Z)</option>
              <option value="title.desc">Title (Z-A)</option>
            </select>
          </div>
        </div>
        <div className={styles.grid}>
          {tvShowsData.results.map((show) => (
            <ContentCard
              key={show.id}
              id={show.id}
              title={show.title} // mapToCardSchema ensures title is present (from name for TV)
              poster_path={show.poster_path} // Corrected to poster_path
              media_type="tv" // Explicitly tv type
              release_date={show.release_date} // mapToCardSchema ensures this is first_air_date for TV
              vote_average={show.vote_average}
              overview={show.overview}
              backdrop_path={show.backdrop_path}
            />
          ))}
        </div>
        <div className={styles.paginationControls}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous Page
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {tvShowsData.total_pages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(tvShowsData.total_pages, prev + 1))}
            disabled={currentPage === tvShowsData.total_pages}
            className={styles.paginationButton}
          >
            Next Page
          </button>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<TVShowsPageProps> = async (context) => {
  const { query } = context;
  const selectedGenre = query.genre as string || '';
  const sortOrder = query.sort as string || 'vote_average.desc';
  const page = parseInt(query.page as string) || 1;
  const limit = 20; // Number of items per page
  const offset = (page - 1) * limit;

  try {
    // Fetch distinct genres for the filter dropdown
    const { data: genresData, error: genresError } = await supabase
      .from('titles')
      .select('genres')
      .eq('media_type', 'tv');
    
    if (genresError) throw genresError;

    const uniqueGenres = Array.from(new Set(genresData.flatMap((item: any) => item.genres || []))).filter(Boolean) as string[];

    let tvShowQuery = supabase
      .from('titles')
      .select('*', { count: 'exact' })
      .eq('media_type', 'tv');

    if (selectedGenre) {
      tvShowQuery = tvShowQuery.contains('genres', [selectedGenre]);
    }

    const [sortBy, sortDirection] = sortOrder.split('.');
    // For TV shows, 'release_date' should map to 'first_air_date' if that's the column in DB
    // Assuming 'release_date' in your DB actually stores the first_air_date for TV shows
    tvShowQuery = tvShowQuery.order(sortBy, { ascending: sortDirection === 'asc' });

    tvShowQuery = tvShowQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await tvShowQuery;

    if (error) throw error;

    // Map the fetched data to ContentCardProps to match the expected interface
    const mappedResults: ContentCardProps[] = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path,
      media_type: item.media_type as 'movie' | 'tv',
      release_date: item.release_date, // This should be first_air_date for TV in your DB
      vote_average: item.vote_average,
      overview: item.overview,
      backdrop_path: item.backdrop_path,
      // Add other properties from your Supabase 'titles' table that match ContentCardProps
    }));

    const tvShowsData: DiscoverResult = {
      page: page,
      results: mappedResults, // Use the mapped results
      total_pages: count ? Math.ceil(count / limit) : 1,
      total_results: count || 0,
    };

    return {
      props: {
        tvShowsData,
        genres: uniqueGenres,
        initialGenre: selectedGenre,
        initialSort: sortOrder,
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch TV shows:', error.message);
    return {
      props: {
        tvShowsData: null,
        error: 'Failed to load TV shows.',
        genres: [],
      },
    };
  }
};

export default TVShowsPage;