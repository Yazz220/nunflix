import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import ContentCard, { ContentCardProps } from '@/components/ContentCard/ContentCard';
import SkeletonCard from '@/components/SkeletonCard/SkeletonCard';
import styles from '@/styles/ExplorePage.module.css';

interface DiscoverResult {
  page: number;
  results: ContentCardProps[];
  total_pages: number;
  total_results: number;
}

interface Genre {
    id: number;
    name: string;
}

const fetchDiscover = async ({ pageParam = 1, queryKey }: { pageParam?: number; queryKey: readonly [string, { media_type: string; genre: string; sort: string; year: string }] }): Promise<DiscoverResult> => {
  const [, { media_type, genre, sort, year }] = queryKey;
  const res = await fetch(`/api/v1/discover?media_type=${media_type}&page=${pageParam}&genre_id=${genre}&sort_by=${sort}&year=${year}`);
  if (!res.ok) {
    throw new Error('Failed to fetch discover data');
  }
  return res.json();
};

const fetchGenres = async ({ queryKey }: { queryKey: readonly [string, { media_type: string }] }): Promise<{ genres: Genre[] }> => {
  const [, { media_type }] = queryKey;
  const res = await fetch(`/api/v1/genres?media_type=${media_type}`);
  if (!res.ok) {
    throw new Error('Failed to fetch genres');
  }
  return res.json();
}

const DiscoverPage: NextPage = () => {
  const router = useRouter();
  const { media_type = 'movie', genre = '', sort = 'popularity.desc', year = '' } = router.query;

  const [mediaType, setMediaType] = useState(media_type);
  const [selectedGenre, setSelectedGenre] = useState(genre);
  const [sortBy, setSortBy] = useState(sort);
  const [selectedYear, setSelectedYear] = useState(year);
  const { ref, inView } = useInView();

  const {
    data: genresData,
    isLoading: genresLoading,
  } = useQuery({
    queryKey: ['genres', { media_type: mediaType as string }] as const,
    queryFn: fetchGenres,
    initialData: { genres: [] },
  });

  const {
    data,
    error,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['discover', { media_type: mediaType as string, genre: selectedGenre as string, sort: sortBy as string, year: selectedYear as string }] as const,
    queryFn: fetchDiscover,
    initialPageParam: 1,
    getNextPageParam: (lastPage: DiscoverResult) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    // When mediaType changes, reset the genre
    setSelectedGenre('');
  }, [mediaType]);

  useEffect(() => {
    router.push(
      `/discover?media_type=${mediaType}&genre=${selectedGenre}&sort=${sortBy}&year=${selectedYear}`,
      undefined,
      { shallow: true }
    );
  }, [mediaType, selectedGenre, sortBy, selectedYear, router]);

  return (
    <div className={styles.explorePageContainer}>
      <Head>
        <title>Discover - Nunflix</title>
        <meta name="description" content="Discover new movies and TV shows on Nunflix" />
      </Head>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Discover</h1>
        <div className={styles.filters}>
          <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} disabled={genresLoading}>
            <option value="">All Genres</option>
            {genresData?.genres?.map((genre: Genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popularity.desc">Popularity Descending</option>
            <option value="popularity.asc">Popularity Ascending</option>
            <option value="release_date.desc">Release Date Descending</option>
            <option value="release_date.asc">Release Date Ascending</option>
            <option value="vote_average.desc">Rating Descending</option>
            <option value="vote_average.asc">Rating Ascending</option>
          </select>
          <input
            type="number"
            placeholder="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />
        </div>
        <div className={styles.grid}>
          {data?.pages.map((page, i) => (
            <React.Fragment key={`page-${i}`}>
              {page.results.map((item: ContentCardProps) => (
                <Link
                  href={`/title/${item.id}?type=${mediaType}`}
                  key={item.id}
                  legacyBehavior>
                  <a>
                    <ContentCard {...item} media_type={mediaType as 'movie' | 'tv'} />
                  </a>
                </Link>
              ))}
            </React.Fragment>
          ))}
          {isFetching && !isFetchingNextPage
            ? Array.from({ length: 20 }).map((_, index) => (
                <SkeletonCard key={`skeleton-discover-${index}`} />
              ))
            : null}
        </div>
        <div ref={ref}>
          {isFetchingNextPage ? <SkeletonCard /> : null}
        </div>
        {error && <p>Error loading data</p>}
      </main>
    </div>
  );
};

export default DiscoverPage;
