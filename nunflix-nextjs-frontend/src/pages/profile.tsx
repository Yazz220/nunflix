import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAuthStore, ContinueWatchingItem as AuthContinueWatchingItem } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore'; // Import useUIStore
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/ProfilePage.module.css';
import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';
import ContentCard, { ContentCardProps } from '@/components/ContentCard/ContentCard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'; // Import LoadingSpinner

// User interface matching authStore
interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  createdAt?: string;
}

// These specific list item types might not be needed if authStore.user contains them directly
// and we fetch full ContentCardProps for display.
// For now, we'll rely on authStore.user.favorites which uses AuthFavoriteItem.

// interface UserProfileData { // This might be simplified if SSR only passes minimal data
//   user: User;
//   // favorites, watchlist, continue will be primarily from authStore on client-side
// }

interface ProfilePageProps {
  // profileDataSSR: UserProfileData | null; // Data fetched on server, if any
  error?: string; // Error from SSR
}

const ProfilePage: NextPage<ProfilePageProps> = ({ error }) => {
  const router = useRouter();
  const {
    isAuthenticated,
    user: authStoreUser,
    token,
    fetchUser,
    favorites: storeFavorites,
    watchlist: storeWatchlist,
    continueWatching: storeContinueWatching, // Get continueWatching directly from the store
  } = useAuthStore();
  const setGlobalError = useUIStore((state) => state.setError);

  const [detailedFavorites, setDetailedFavorites] = useState<ContentCardProps[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [detailedWatchlist, setDetailedWatchlist] = useState<ContentCardProps[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  const [detailedContinueWatching, setDetailedContinueWatching] = useState<ContentCardProps[]>([]); // Added
  const [isLoadingContinueWatching, setIsLoadingContinueWatching] = useState(false); // Added

  useEffect(() => {
    if (error) {
      router.replace('/login');
    } else if (!isAuthenticated && !token) { // Not authenticated and no token to attempt fetch
      router.replace('/login');
    } else if (isAuthenticated && !authStoreUser) {
      // Authenticated (e.g. token loaded from localStorage) but user object not yet fetched
      fetchUser().catch((err: any) => {
        console.error("Failed to fetch user on profile page:", err);
        const message = err.response?.data?.error || err.message || 'Failed to load user profile. Please try logging in again.';
        setGlobalError(message);
        router.replace('/login');
      });
    }
  }, [error, router, isAuthenticated, authStoreUser, token, fetchUser]);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (storeFavorites.length === 0 || !isAuthenticated) {
        setDetailedFavorites([]);
        return;
      }
      setIsLoadingFavorites(true);
      try {
        const favoriteTitleIds = storeFavorites.map(fav => fav.id);
        if (favoriteTitleIds.length === 0) {
          setDetailedFavorites([]);
          setIsLoadingFavorites(false);
          return;
        }
        const { data, error } = await supabase.from('titles').select('*').in('id', favoriteTitleIds);
        if (error) throw error;
        setDetailedFavorites(data || []);
      } catch (err: any) {
        console.error("Error fetching favorite details:", err);
        setGlobalError(err.message || 'An unexpected error occurred while loading favorites.');
        setDetailedFavorites([]);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    if (isAuthenticated) {
      fetchFavoriteDetails();
    }
  }, [storeFavorites, isAuthenticated, token]);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      if (storeWatchlist.length === 0 || !isAuthenticated) {
        setDetailedWatchlist([]);
        return;
      }
      setIsLoadingWatchlist(true);
      try {
        const watchlistTitleIds = storeWatchlist.map(item => item.id);
        if (watchlistTitleIds.length === 0) {
          setDetailedWatchlist([]);
          setIsLoadingWatchlist(false);
          return;
        }
        const { data, error } = await supabase.from('titles').select('*').in('id', watchlistTitleIds);
        if (error) throw error;
        setDetailedWatchlist(data || []);
      } catch (err: any) {
        console.error("Error fetching watchlist details:", err);
        setGlobalError(err.message || 'An unexpected error occurred while loading watchlist.');
        setDetailedWatchlist([]);
      } finally {
        setIsLoadingWatchlist(false);
      }
    };

    if (isAuthenticated) {
      fetchWatchlistDetails();
    }
  }, [storeWatchlist, isAuthenticated, token]);

  useEffect(() => {
    const fetchContinueWatchingDetails = async () => {
      if (storeContinueWatching.length === 0 || !isAuthenticated) {
        setDetailedContinueWatching([]);
        return;
      }
      setIsLoadingContinueWatching(true);
      try {
        const continueWatchingTitleIds = storeContinueWatching.map(item => item.id);
        if (continueWatchingTitleIds.length === 0) {
          setDetailedContinueWatching([]);
          setIsLoadingContinueWatching(false);
          return;
        }
        const { data: titles, error } = await supabase.from('titles').select('*').in('id', continueWatchingTitleIds);
        if (error) throw error;

        const mergedData = titles.map(title => {
          const progress = storeContinueWatching.find(item => item.id === title.id);
          return {
            ...title,
            progress: progress ? progress.progress_seconds / progress.duration_seconds : 0,
            progress_seconds: progress?.progress_seconds,
            duration_seconds: progress?.duration_seconds,
          };
        });
        setDetailedContinueWatching(mergedData);
      } catch (err: any) {
        console.error("Error fetching continue watching details:", err);
        setGlobalError(err.message || 'An unexpected error occurred while loading items you were watching.');
        setDetailedContinueWatching([]);
      } finally {
        setIsLoadingContinueWatching(false);
      }
    };

    if (isAuthenticated) {
      fetchContinueWatchingDetails();
    }
  }, [storeContinueWatching, isAuthenticated, token]);


  if (error) {
    return <div className={styles.pageContainer}><p>Error: {error}. Redirecting...</p></div>;
  }

  const displayUser = authStoreUser; // Rely on Zustand store for user data

  if (!isAuthenticated || !displayUser) {
    return (
      // Use fullPage spinner for initial profile load
      <LoadingSpinner fullPage />
    );
  }
  
  const joinDate = displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>{displayUser.username}'s Profile - Nunflix</title>
        <meta name="description" content={`Profile page for ${displayUser.username} on Nunflix`} />
      </Head>
      <main className={styles.mainContent}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <Image
              src={displayUser.avatar_url || '/placeholder-poster.png'}
              alt={`${displayUser.username}'s avatar`}
              width={150}
              height={150}
              className={styles.avatar}
              unoptimized={!displayUser.avatar_url}
            />
          </div>
          <h1 className={styles.username}>{displayUser.username}</h1>
          <p className={styles.email}>{displayUser.email}</p>
          <p className={styles.joinDate}>Joined: {joinDate}</p>
        </div>

        {/* Render Favorites */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>My Favorites</h2>
          {/* Pass isLoadingFavorites to Carousel */}
          <Carousel
            title=""
            items={detailedFavorites}
            isLargeRow={false}
            isLoading={isLoadingFavorites}
            skeletonCount={5} // Example count
          />
          {!isLoadingFavorites && detailedFavorites.length === 0 && (
            <p>You haven't favorited anything yet.</p>
          )}
        </section>

        {/* Render Continue Watching */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Continue Watching</h2>
          {/* Pass isLoadingContinueWatching to Carousel */}
          <Carousel
            title=""
            items={detailedContinueWatching}
            isLargeRow={false}
            isLoading={isLoadingContinueWatching}
            skeletonCount={5}
          />
          {!isLoadingContinueWatching && detailedContinueWatching.length === 0 && (
            <p>Nothing to continue watching.</p>
          )}
        </section>

        {/* Render Watchlist */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>My Watchlist</h2>
          {/* Pass isLoadingWatchlist to Carousel */}
          <Carousel
            title=""
            items={detailedWatchlist}
            isLargeRow={false}
            isLoading={isLoadingWatchlist}
            skeletonCount={5}
          />
          {!isLoadingWatchlist && detailedWatchlist.length === 0 && (
            <p>Your watchlist is empty.</p>
          )}
        </section>
      </main>
    </div>
  );
};

// getServerSideProps is simplified. It's mainly to allow the page to render
// and let client-side take over for auth and data fetching.
// For true SSR of profile data, a robust cookie-based auth token mechanism is needed.
export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context) => {
  // No attempt to fetch user data here without a reliable way to get token (e.g. HttpOnly cookie)
  // Client-side will handle auth check and data fetching using token from localStorage.
  return {
    props: {
      // profileDataSSR: null, // No SSR data for now, client handles all
    },
  };
};

export default ProfilePage;