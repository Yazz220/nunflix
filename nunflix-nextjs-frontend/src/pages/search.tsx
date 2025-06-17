import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import ContentCard, { ContentCardProps } from '@/components/ContentCard/ContentCard';
import SkeletonCard from '@/components/SkeletonCard/SkeletonCard'; // Import SkeletonCard
import styles from '@/styles/ExplorePage.module.css';

// Interface for the items in the search results (mini-card schema from research)
interface SearchResultItem extends Omit<ContentCardProps, 'media_type'> {
  media_type: 'movie' | 'tv' | 'person'; // Search can return people too
  known_for_department?: string; // For person type
}

interface SearchAPIResponse {
  page: number;
  results: SearchResultItem[];
  total_pages: number;
  total_results: number;
}

interface SearchPageProps {
  searchResults: SearchAPIResponse | null;
  query: string;
  error?: string;
}

const SearchPage: NextPage<SearchPageProps> = ({ searchResults, query, error }) => {
  const router = useRouter(); // Can still use this for other client-side logic if needed

  if (error) {
    return (
      <div className={styles.explorePageContainer}>
        <main className={styles.mainContent}>
          <h1>Search Results for "{query}"</h1>
          <p>Error loading search results: {error}</p>
        </main>
      </div>
    );
  }

  if (!searchResults) { // If no data and no error, show skeletons
    const skeletonCount = 12; // Number of skeletons to show
    return (
      <div className={styles.explorePageContainer}>
        <Head>
          <title>Searching for "{query}"... - Nunflix</title>
        </Head>
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Searching for "{query}"...</h1>
          <div className={styles.grid}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={`skeleton-search-${index}`} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  
  if (searchResults.results.length === 0) {
    return (
      <div className={styles.explorePageContainer}>
        <Head>
          <title>No results for "{query}" - Nunflix</title>
        </Head>
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>No results for "{query}"</h1>
          <p>Please try a different search term.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.explorePageContainer}>
      <Head>
        <title>Search results for "{query}" - Nunflix</title>
        <meta name="description" content={`Search results for ${query} on Nunflix`} />
      </Head>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Search Results for "{query}"</h1>
        <div className={styles.grid}>
          {searchResults.results.map((item) => {
            // For 'person' type, we might want a different card or link structure.
            // For now, ContentCard will render what it can.
            if (item.media_type === 'person') {
              // Placeholder for person card - or adapt ContentCard to handle person
              return (
                <div key={item.id} className={styles.personCardPlaceholder}>
                  <p>{item.title} ({item.known_for_department})</p>
                  {item.poster && <img src={`https://image.tmdb.org/t/p/w185${item.poster}`} alt={item.title} width="100" />}
                </div>
              );
            }
            return (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                poster={item.poster || ''}
                media_type={item.media_type as 'movie' | 'tv'} // Cast because ContentCard expects movie/tv
                release_date={item.release_date}
                // vote_average and other props might not be in search/multi results,
                // ContentCardProps makes them optional.
              />
            );
          })}
        </div>
        {/* TODO: Add pagination for search results */}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const query = context.query.q as string || '';

  if (!query) {
    return { props: { searchResults: null, query: '', error: 'Please enter a search term.' } };
  }

  try {
    const { data, error } = await supabase
      .from('titles')
      .select('*')
      .textSearch('title', `'${query}'`);

    if (error) throw error;

    const searchResults: SearchAPIResponse = {
      page: 1,
      results: data || [],
      total_pages: 1, // TODO: Implement pagination
      total_results: data?.length || 0,
    };

    return {
      props: {
        searchResults,
        query,
      },
    };
  } catch (error: any) {
    console.error(`Failed to fetch search results for "${query}":`, error.message);
    return {
      props: {
        searchResults: null,
        query,
        error: `Failed to load search results for "${query}".`,
      },
    };
  }
};

export default SearchPage;