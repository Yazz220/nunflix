import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ProfilePageComponent from '@/components/ProfilePage/ProfilePage';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, user, token, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace('/login');
    } else if (isAuthenticated && !user) {
      fetchUser().catch((err: any) => {
        console.error("Failed to fetch user on profile page:", err);
        router.replace('/login');
      });
    }
  }, [isAuthenticated, user, token, fetchUser, router]);

  if (!isAuthenticated || !user) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <>
      <Head>
        <title>{user.username}'s Profile - Nunflix</title>
        <meta name="description" content={`Profile page for ${user.username} on Nunflix`} />
      </Head>
      <ProfilePageComponent />
    </>
  );
};

export default ProfilePage;
