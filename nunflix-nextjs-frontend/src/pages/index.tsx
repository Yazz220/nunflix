import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Carousel from '@/components/Carousel/Carousel';
import { ContentCardProps } from '@/components/ContentCard/ContentCard';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'; // Import the spinner

// Expected structure from /api/v1/frontpage
interface FrontPageData {
  [key: string]: ContentCardProps[];
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
    return <LoadingSpinner fullPage />;
  }

  const heroItem = frontPageData.trending && frontPageData.trending.length > 0 ? frontPageData.trending[0] : null;

  const SECTIONS = [
    { key: 'trending', title: 'Trending Now', isLargeRow: true },
    { key: 'must_watch', title: 'Must Watch' },
    { key: 'apple_tv', title: 'Apple TV+', logoUrl: 'https://image.tmdb.org/t/p/w92/9zZzJeMC2iYnFVc2aDP1XGgIqza.png' },
    { key: 'starz', title: 'Starz', logoUrl: 'https://image.tmdb.org/t/p/w92/wZkKY6aL1kK28wA5S7N0wP3f8aA.png' },
    { key: 'dc', title: 'DC', logoUrl: 'https://image.tmdb.org/t/p/w92/4P82uYnB9e7aP3D2a2H2tIuM3d.png' },
    { key: 'prime_video', title: 'Prime Video', logoUrl: 'https://image.tmdb.org/t/p/w92/6oE0ab60s3sA529iZzB02g3b6g.png' },
    { key: 'hbo', title: 'HBO', logoUrl: 'https://image.tmdb.org/t/p/w92/aS2zvP4sfv1x3bFFoRiw8Pa7V6a.png' },
    { key: 'cartoon_network', title: 'Cartoon Network', logoUrl: 'https://image.tmdb.org/t/p/w92/fSpP1N22h4D7qr82x1jJ3e1aY5A.png' },
    { key: 'showtime', title: 'Showtime', logoUrl: 'https://image.tmdb.org/t/p/w92/28gJbiGj33c5H13gD5i8aA6jXl.png' },
    { key: 'hulu', title: 'Hulu', logoUrl: 'https://image.tmdb.org/t/p/w92/z5VFC2gccx6f4FfD7fe7dphv7g.png' },
    { key: 'disney', title: 'Walt Disney Pictures', logoUrl: 'https://image.tmdb.org/t/p/w92/wdrCwmkt1s2zB4iFBMbAMi4rIq.png' },
    { key: 'nickelodeon', title: 'Nickelodeon', logoUrl: 'https://image.tmdb.org/t/p/w92/5VnSgU0EM63a0i4wsj2v0R2K3a.png' },
    { key: 'peacock', title: 'Peacock', logoUrl: 'https://image.tmdb.org/t/p/w92/x17l3V6DkUYJcUGW8uL6o23S86.png' },
    { key: 'crunchyroll', title: 'Crunchyroll', logoUrl: 'https://image.tmdb.org/t/p/w92/vj4I0Lcf3DT6yH8G3pSjW3mCgD.png' },
    { key: 'anime', title: 'Anime' },
  ];

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
          {SECTIONS.map(section => (
            frontPageData[section.key] && frontPageData[section.key].length > 0 && (
              <Carousel
                key={section.key}
                title={section.title}
                logoUrl={section.logoUrl}
                items={frontPageData[section.key]}
                isLargeRow={section.isLargeRow}
              />
            )
          ))}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    // Fetch data from the frontpage API route
    const res = await fetch('http://localhost:3000/api/v1/frontpage');
    if (!res.ok) {
      throw new Error('Failed to fetch frontpage data');
    }
    const frontPageData = await res.json();

    return {
      props: {
        frontPageData,
      },
      revalidate: 3600, // Re-generate the page every hour
    };
  } catch (error) {
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
