import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppView = 
  | 'dashboard' 
  | 'stok_ff' 
  | 'stok_ml' 
  | 'pencarian' 
  | 'akun_masuk' 
  | 'kalender_keuangan' 
  | 'statistik' 
  | 'riwayat_penjualan' 
  | 'wishlist'
  | 'jurnal';

export interface SavedAccount {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

interface AppState {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  // Cloud sync states
  isSyncing: boolean;
  setSyncing: (status: boolean) => void;
  lastSynced: string;
  updateSyncTime: () => void;
  shopName: string;
  shopSubtitle: string;
  setShopName: (name: string) => void;
  setShopSubtitle: (subtitle: string) => void;
  // Global Filters
  globalSearch: string;
  globalMonth: string;
  globalYear: string;
  setGlobalSearch: (query: string) => void;
  setGlobalMonth: (month: string) => void;
  setGlobalYear: (year: string) => void;
  resetGlobalFilters: () => void;
  
  // Cross-page navigation highlight
  highlightAccountId: string | null;
  setHighlightAccountId: (id: string | null) => void;

  // Auth State
  isLoggedIn: boolean;
  guestMode: boolean;
  userId: string | null;
  userName: string;
  userEmail: string;
  userPhoto: string;
  setUser: (user: { uid: string; displayName: string; email: string; photoURL: string }) => void;
  clearUser: () => void;
  setGuestMode: (status: boolean) => void;
  
  // Multi-Account Support
  savedAccounts: SavedAccount[];
  addSavedAccount: (account: SavedAccount) => void;
  removeSavedAccount: (email: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }),
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      isSyncing: false,
      setSyncing: (status) => set({ isSyncing: status }),
      lastSynced: 'Belum pernah disinkronisasi',
      updateSyncTime: () => set({ lastSynced: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }),
      shopName: 'My Shop',
      shopSubtitle: 'Management',
      setShopName: (name) => set({ shopName: name }),
      setShopSubtitle: (subtitle) => set({ shopSubtitle: subtitle }),
      
      globalSearch: '',
      globalMonth: 'Semua',
      globalYear: 'Semua',
      setGlobalSearch: (query) => set({ globalSearch: query }),
      setGlobalMonth: (month) => set({ globalMonth: month }),
      setGlobalYear: (year) => set({ globalYear: year }),
      resetGlobalFilters: () => set({ globalSearch: '', globalMonth: 'Semua', globalYear: 'Semua' }),
      
      highlightAccountId: null,
      setHighlightAccountId: (id) => set({ highlightAccountId: id }),

      isLoggedIn: false,
      guestMode: false,
      userId: null,
      userName: '',
      userEmail: '',
      userPhoto: '',
      setUser: (user) => set({ 
        isLoggedIn: true, 
        guestMode: false,
        userId: user.uid, 
        userName: user.displayName, 
        userEmail: user.email,
        userPhoto: user.photoURL 
      }),
      clearUser: () => set({ 
        isLoggedIn: false, 
        guestMode: false,
        userId: null, 
        userName: '', 
        userEmail: '',
        userPhoto: '' 
      }),
      setGuestMode: (status) => set({ guestMode: status }),

      savedAccounts: [],
      addSavedAccount: (account) => set((state) => {
        // Prevent duplicates by email
        if (state.savedAccounts.find(a => a.email === account.email)) return state;
        return { savedAccounts: [...state.savedAccounts, account] };
      }),
      removeSavedAccount: (email) => set((state) => ({
        savedAccounts: state.savedAccounts.filter(a => a.email !== email)
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        shopName: state.shopName,
        shopSubtitle: state.shopSubtitle,
        lastSynced: state.lastSynced,
        savedAccounts: state.savedAccounts,
        isLoggedIn: state.isLoggedIn,
        guestMode: state.guestMode,
        userId: state.userId,
        userName: state.userName,
        userEmail: state.userEmail,
        userPhoto: state.userPhoto
      }),
    }
  )
);
