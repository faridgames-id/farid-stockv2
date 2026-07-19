import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  namaBarang: string;
  kategori: string;
  estimasiHarga: number;
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi';
  spesifikasi: string;
  linkToko: string;
  catatan: string;
  statusPembelian: 'Belum' | 'Sudah Terima';
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  setAllItems: (items: WishlistItem[]) => void;
  resetStore: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setAllItems: (items) => set({ items }),
      resetStore: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
