import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import ContentCard, { ContentCardProps } from '@/components/ContentCard/ContentCard';
import SkeletonCard from '@/components/SkeletonCard/SkeletonCard';
import styles from '@/styles/ExplorePage.module.css';
import { CATEGORY_MAP } from '@/lib/category-map';

interface DiscoverResult {
  page: number;
  results: ContentCardProps[];
  total_pages: number;
  total_results: number;
}

const fetchDiscover = async ({ pageParam = 1, queryKey }: QueryFunctionContext<[string, { media_type: string;[key: string]: unknown; }]>) => {
  const [, { media_type, ...params }] = queryKey;
  const queryString = new URLSearchParams({
    media_type,
    page: String(pageParam),
    ...(params as Record<string, string>),
  }).toString();
  const res = await fetch(`/api/v1/discover?${queryString}`);
  if (!res.ok) {
    throw new Error('Failed to fetch discover data');
  }
  return res.json();
};

interface CategoryPageProps {
  mediaType: 'movie' | 'tv' | 'all';
  filter: string;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ mediaType, filter }) => {
  const { ref, inView } = useInView();

  const mappedParams = CATEGORY_MAP[filter] || {};

  const {
    data,
    error,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<DiscoverResult, Error>({
    queryKey: ['discover', { media_type: mediaType, ...mappedParams }],
    queryFn: fetchDiscover,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
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

  const title = filter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className={styles.explorePageContainer}>
      <Head>
        <title>{title} - Nunflix</title>
        <meta name="description" content={`Discover ${title} on Nunflix`} />
      </Head>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.grid}>
          {data?.pages.map((page, i) => (
            <React.Fragment key={`page-${i}`}>
              {page.results.map((item: ContentCardProps) => (
                <ContentCard {...item} key={item.id} />
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

export default CategoryPage;
