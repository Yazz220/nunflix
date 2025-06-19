import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import styles from '@/styles/ProfilePage.module.css';
import Message from './Message';
import ContentCard from '@/components/ContentCard/ContentCard';
import { Title } from '../../types';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
  { key: 'history', label: 'History' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'watchlist', label: 'Watchlist' },
];

const ProfilePage = () => {
  const { user, profile, fetchProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [history, setHistory] = useState<Title[]>([]);
  const [favorites, setFavorites] = useState<Title[]>([]);
  const [watchlist, setWatchlist] = useState<Title[]>([]);
  const [settings, setSettings] = useState({
    email_notifications: false,
    profile_public: false,
  });

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    } else {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile, fetchProfile]);

  useEffect(() => {
    setDirty(
      displayName !== (profile?.display_name || '') ||
      bio !== (profile?.bio || '') ||
      avatarUrl !== (profile?.avatar_url || '')
    );
  }, [displayName, bio, avatarUrl, profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/v1/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      await fetchProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setDirty(false);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const fetchListData = useCallback(async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const response = await fetch(`/api/v1/profile/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      const data = await response.json();
      setter(data.data);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchListData('history', setHistory);
    } else if (activeTab === 'favorites') {
      fetchListData('favorites', setFavorites);
    } else if (activeTab === 'watchlist') {
      fetchListData('watchlist', setWatchlist);
    } else if (activeTab === 'settings') {
      fetchListData('settings', setSettings);
    }
  }, [activeTab, fetchListData]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <nav className={styles.tabNav}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className={styles.tabPanel}>
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
            {message && <Message type={message.type}>{message.text}</Message>}
            <div className={styles.avatarPreviewWrapper}>
              <img
                src={avatarUrl || '/placeholder-poster.png'}
                alt="Avatar Preview"
                className={styles.avatar}
                width={120}
                height={120}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="avatarUrl">Avatar URL</label>
              <input
                id="avatarUrl"
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading || !dirty} className={styles.saveButton}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
        {activeTab === 'settings' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setMessage(null);
              try {
                const response = await fetch('/api/v1/profile/settings', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(settings),
                });
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || 'Failed to update settings');
                }
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
              } catch (error) {
                setMessage({ type: 'error', text: (error as Error).message });
              } finally {
                setLoading(false);
              }
            }}
            className={styles.profileForm}
          >
            <h2>Settings</h2>
            {message && <Message type={message.type}>{message.text}</Message>}
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) =>
                    setSettings({ ...settings, email_notifications: e.target.checked })
                  }
                />
                Enable Email Notifications
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.profile_public}
                  onChange={(e) =>
                    setSettings({ ...settings, profile_public: e.target.checked })
                  }
                />
                Make Profile Public
              </label>
            </div>
            <button type="submit" disabled={loading} className={styles.saveButton}>
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
        {activeTab === 'history' && (
          <div>
            <h2>Recently Watched</h2>
            <div className={styles.grid}>
              {history.map((item) => (
                <ContentCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'favorites' && (
          <div>
            <h2>Favorites</h2>
            <div className={styles.grid}>
              {favorites.map((item) => (
                <ContentCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'watchlist' && (
          <div>
            <h2>Watchlist</h2>
            <div className={styles.grid}>
              {watchlist.map((item) => (
                <ContentCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
