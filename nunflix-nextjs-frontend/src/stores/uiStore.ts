import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  globalError: string | null;
  isMobileMenuOpen: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  globalError: null,
  isMobileMenuOpen: false,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ globalError: error }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));