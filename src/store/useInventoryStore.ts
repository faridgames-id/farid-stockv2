import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccountItem {
  id: string;
  game: 'Free Fire' | 'Mobile Legends';
  spec: string;
  rank: string;
  hargaBeli: number;
  hargaJual: number;
  targetJual?: number;
  status: 'Ready' | 'Terjual' | 'Cicilan';
  email: string;
  device: string;
  bulanMasuk: string;
  tanggalMasuk?: string;
  namaPenjual: string;
  pembeli?: string;
  tanggalJual?: string;
  password?: string;
  loginVia?: string;
  catatan: string;
  totalDibayar?: number;
  riwayatCicilan?: { id: string, tanggal: string, jumlah: number }[];
}

interface InventoryState {
  accounts: AccountItem[];
  addAccount: (account: AccountItem) => void;
  removeAccount: (id: string) => void;
  updateAccountStatus: (id: string, status: 'Ready' | 'Terjual' | 'Cicilan') => void;
  editAccount: (updatedAccount: AccountItem) => void;
  setAllAccounts: (accounts: AccountItem[]) => void;
  tambahCicilan: (id: string, jumlah: number, tanggal: string) => void;
  resetStore: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (account) => set((state) => ({ accounts: [account, ...state.accounts] })),
      removeAccount: (id) => set((state) => ({ accounts: state.accounts.filter((acc) => acc.id !== id) })),
      updateAccountStatus: (id, status) => set((state) => ({
        accounts: state.accounts.map((acc) => acc.id === id ? { ...acc, status } : acc)
      })),
      editAccount: (updatedAccount) => set((state) => ({
        accounts: state.accounts.map((acc) => acc.id === updatedAccount.id ? updatedAccount : acc)
      })),
      setAllAccounts: (accounts) => set({ accounts }),
      tambahCicilan: (id, jumlah, tanggal) => set((state) => ({
        accounts: state.accounts.map((acc) => {
          if (acc.id === id) {
            const riwayat = acc.riwayatCicilan || [];
            const newTotal = (acc.totalDibayar || 0) + jumlah;
            // Optionally auto-mark as 'Terjual' if total >= targetJual
            const isLunas = newTotal >= (acc.targetJual || acc.hargaJual);
            return {
              ...acc,
              totalDibayar: newTotal,
              riwayatCicilan: [...riwayat, { id: Math.random().toString(36).substring(7), tanggal, jumlah }],
              status: isLunas ? 'Terjual' : acc.status
            };
          }
          return acc;
        })
      })),
      resetStore: () => set({ accounts: [] }),
    }),
    {
      name: 'inventory-storage',
    }
  )
);
