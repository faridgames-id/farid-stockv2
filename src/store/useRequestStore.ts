import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RequestOrder {
  id: string;
  tanggalBeli: string;
  tanggalJual: string;
  namaPembeli: string;
  namaReseller: string;
  game: string;
  spec: string;
  hargaBeli: number;
  hargaJual: number;
  statusPembayaran: 'Lunas' | 'Cicilan';
  status: 'Mencari' | 'Ditemukan' | 'Selesai';
}

interface RequestState {
  orders: RequestOrder[];
  addOrder: (order: RequestOrder) => void;
  removeOrder: (id: string) => void;
  setAllOrders: (orders: RequestOrder[]) => void;
}

export const useRequestStore = create<RequestState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      removeOrder: (id) => set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),
      setAllOrders: (orders) => set({ orders }),
    }),
    {
      name: 'request-storage',
    }
  )
);
