import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client

export interface FavoriteItem {
  id: number; // TMDB ID
  type: 'movie' | 'tv';
  title?: string; // Optional: for quick display if available
  poster_path?: string;
}

export interface ContinueWatchingItem {
  id: number; // TMDB ID (media_id from backend)
  type: 'movie' | 'tv';
  title?: string;
  poster_path?: string;
  progress_seconds: number;
  duration_seconds: number;
  last_watched_at: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  createdAt?: string;
  favorites?: FavoriteItem[];
  watchlist?: FavoriteItem[];
  continue_watching?: ContinueWatchingItem[]; // Renamed from 'continue' for clarity
}

interface Profile {
  id: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  profile: Profile | null;
  favorites: FavoriteItem[];
  watchlist: FavoriteItem[];
  continueWatching: ContinueWatchingItem[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setFavorites: (items: FavoriteItem[]) => void;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (itemId: number) => void;
  isFavorited: (itemId: number) => boolean;
  setWatchlist: (items: FavoriteItem[]) => void; // Added
  addToWatchlist: (item: FavoriteItem) => void; // Added
  removeFromWatchlist: (itemId: number) => void; // Added
  isOnWatchlist: (itemId: number) => boolean; // Added
  updateProgress: (titleId: number, seasonNumber: number | null, episodeNumber: number | null, position: number, duration: number, mediaType: 'movie' | 'tv') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  profile: null,
  favorites: [],
  watchlist: [],
  continueWatching: [],
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      set({ user: data.user as unknown as User, isAuthenticated: true });
      get().fetchUser();
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, favorites: [], watchlist: [], continueWatching: [] });
  },
  register: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });
    if (error) throw error;
    if (data.user) {
      set({ user: data.user as unknown as User, isAuthenticated: true });
    }
  },
  fetchUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const profile: User = {
        id: user.id,
        email: user.email || '',
        username: user.user_metadata.username || user.email || '',
        avatar_url: user.user_metadata.avatar_url,
        display_name: user.user_metadata.display_name,
        bio: user.user_metadata.bio,
        createdAt: user.created_at,
      };
      set({ user: profile, isAuthenticated: true });
      
      const { data: favorites, error: favoritesError } = await supabase.from('favorites').select('*, titles(*)').eq('user_id', user.id);
      if (favoritesError) console.error('Error fetching favorites:', favoritesError);
      else set({ favorites: favorites.map(f => ({...f.titles, type: f.titles.media_type})) });

      const { data: watchlist, error: watchlistError } = await supabase.from('watchlist').select('*, titles(*)').eq('user_id', user.id);
      if (watchlistError) console.error('Error fetching watchlist:', watchlistError);
      else set({ watchlist: watchlist.map(f => ({...f.titles, type: f.titles.media_type})) });

      const { data: continueWatching, error: continueWatchingError } = await supabase.from('progress').select('*, titles(*)').eq('user_id', user.id);
      if (continueWatchingError) console.error('Error fetching continue watching:', continueWatchingError);
      else set({ continueWatching: continueWatching.map(f => ({...f.titles, ...f, type: f.titles.media_type})) });

    } else {
      set({ user: null, isAuthenticated: false, favorites: [], watchlist: [], continueWatching: [] });
    }
  },
  fetchProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, avatar_url, display_name, bio')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        set({ profile: data });
      }
    }
  },
  setFavorites: (items) => set({ favorites: items }),
  addFavorite: async (item) => {
    const user = get().user;
    if (!user) return;
    const { error } = await supabase.from('favorites').insert([{ user_id: user.id, title_id: item.id }]);
    if (error) console.error('Error adding favorite:', error);
    else set((state) => ({ favorites: [...state.favorites, item] }));
  },
  removeFavorite: async (itemId) => {
    const user = get().user;
    if (!user) return;
    const { error } = await supabase.from('favorites').delete().match({ user_id: user.id, title_id: itemId });
    if (error) console.error('Error removing favorite:', error);
    else set((state) => ({ favorites: state.favorites.filter((fav) => fav.id !== itemId) }));
  },
  isFavorited: (itemId) => {
    return get().favorites.some((fav) => fav.id === itemId);
  },
  setWatchlist: (items) => set({ watchlist: items }), // Added
  addToWatchlist: async (item) => {
    const user = get().user;
    if (!user) return;
    const { error } = await supabase.from('watchlist').insert([{ user_id: user.id, title_id: item.id }]);
    if (error) console.error('Error adding to watchlist:', error);
    else set((state) => ({ watchlist: [...state.watchlist, item] }));
  },
  removeFromWatchlist: async (itemId) => {
    const user = get().user;
    if (!user) return;
    const { error } = await supabase.from('watchlist').delete().match({ user_id: user.id, title_id: itemId });
    if (error) console.error('Error removing from watchlist:', error);
    else set((state) => ({ watchlist: state.watchlist.filter((wl) => wl.id !== itemId) }));
  },
  isOnWatchlist: (itemId: number) => { // Added
    return get().watchlist.some((wl) => wl.id === itemId);
  },
  updateProgress: async (titleId: number, seasonNumber: number | null, episodeNumber: number | null, position: number, duration: number, mediaType: 'movie' | 'tv') => {
    const user = get().user;
    if (!user) return;

    const { error } = await supabase.from('progress').upsert({
      user_id: user.id,
      title_id: titleId,
      season_number: seasonNumber,
      episode_number: episodeNumber,
      position: position,
      duration: duration,
      media_type: mediaType,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,title_id,season_number,episode_number' });

    if (error) {
      console.error('Error updating progress:', error);
    }
  },
}));

// Attempt to load user on initial app load if token exists
if (typeof window !== 'undefined') {
  const initialToken = localStorage.getItem('nunflix-token');
  if (initialToken) {
    useAuthStore.setState({ token: initialToken }); // Set token to allow fetchUser to use it
    // No need to await, fetchUser will update state when done
    useAuthStore.getState().fetchUser().catch(error => {
        console.error("Initial fetchUser failed:", error);
        // State is already cleared within fetchUser on error
    });
  }
}
