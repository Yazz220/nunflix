import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { supabase } from '@/lib/supabaseClient';
import Carousel from '@/components/Carousel/Carousel';
import { ContentCardProps } from '@/components/ContentCard/ContentCard';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'; // Import the spinner

// Expected structure from /api/v1/frontpage
// ContentCardProps now includes overview and backdrop_path
interface FrontPageData {
  trending: ContentCardProps[]; // Can use ContentCardProps directly
  popular_movies: ContentCardProps[];
  popular_tv: ContentCardProps[];
  top_rated: ContentCardProps[];
  titles: ContentCardProps[]; // Add titles array to the interface
  // top_rated_tv?: ContentCardProps[]; // If we add this to backend
}

interface HomePageProps {
  frontPageData: FrontPageData | null;
  error?: string;
}

const HomePage: NextPage<HomePageProps> = ({ frontPageData, error }) => {
  if (error) {
    return <p>Error loading page: {error}</p>;
  }

  if (!frontPageData) {
    // If data is null and there's no error, it implies loading (e.g. initial state before SSR resolves)
    // Or if client-side fetching were implemented and in progress.
    return <LoadingSpinner fullPage />;
  }

  const heroItem = frontPageData.trending && frontPageData.trending.length > 0 ? frontPageData.trending[0] : null;

  // Group titles by watch provider
  const groupedByProvider: { [key: string]: ContentCardProps[] } = {};

  frontPageData.titles.forEach(item => {
    if (item.watch_providers) {
      const providers = typeof item.watch_providers === 'string' ? JSON.parse(item.watch_providers) : item.watch_providers;
      if (providers && providers.length > 0) {
        providers.forEach((provider: any) => {
          if (!groupedByProvider[provider.provider_name]) {
            groupedByProvider[provider.provider_name] = [];
          }
          groupedByProvider[provider.provider_name].push(item);
        });
      }
    }
  });

  // Define a whitelist of popular providers to display.
  const POPULAR_PROVIDERS = new Set([
    'Netflix',
    'Amazon Prime Video',
    'Hulu',
    'Max',
    'HBO Max', // Included for older data, will be displayed as Max
    'Disney Plus',
    'Apple TV+',
    'Paramount Plus',
    'Peacock',
    'Starz'
  ]);

  // Filter and sort the providers to be displayed.
  const sortedProviderNames = Object.keys(groupedByProvider)
    .filter(name => POPULAR_PROVIDERS.has(name))
    .sort();

  return (
    <div>
      <Head>
        <title>Nunflix - Watch TV Shows Online, Watch Movies Online</title>
        <meta name="description" content="Nunflix - Your destination for movies and TV shows." />
      </Head>

      <main>
        {heroItem && (
          <HeroBanner
            id={heroItem.id}
            title={heroItem.title}
            backdrop_path={heroItem.backdrop_path ?? null} // Provide null if undefined
            overview={heroItem.overview}
            media_type={heroItem.media_type}
          />
        )}
        <div>
          {/* Trending Now carousel remains at the top */}
          {frontPageData.trending && frontPageData.trending.length > 0 && (
            <Carousel title="Trending Now" items={frontPageData.trending} isLargeRow />
          )}

          {/* Dynamically render carousels for each watch provider */}
          {sortedProviderNames.map(providerName => (
            groupedByProvider[providerName] && groupedByProvider[providerName].length > 0 && (
              <Carousel
                key={providerName}
                title={`${providerName} ~`}
                items={groupedByProvider[providerName]}
              />
            )
          ))}

          {/* Optionally keep popular and top-rated carousels, or remove if grouped by provider covers them */}
          {/*
          {frontPageData.popular_movies && frontPageData.popular_movies.length > 0 && (
            <Carousel title="Popular Movies" items={frontPageData.popular_movies} />
          )}
          {frontPageData.popular_tv && frontPageData.popular_tv.length > 0 && (
            <Carousel title="Popular TV Shows" items={frontPageData.popular_tv} />
          )}
          {frontPageData.top_rated && frontPageData.top_rated.length > 0 && (
            <Carousel title="Top Rated Movies" items={frontPageData.top_rated} />
          )}
          */}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/frontpage');
    if (!res.ok) {
      throw new Error('Failed to fetch front page data');
    }
    const frontPageData = await res.json();

    return {
      props: {
        frontPageData,
      },
      revalidate: 3600, // Re-generate the page every hour
    };
  } catch (error: any) {
    console.error('Failed to fetch frontpage data in getStaticProps:', error);
    return {
      props: {
        frontPageData: null,
        error: 'Failed to load data.',
      },
    };
  }
};

export default HomePage;
