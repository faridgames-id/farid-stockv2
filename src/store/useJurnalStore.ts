import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JurnalEntry {
  id: string;
  tanggal: string;
  kategori: string;
  catatan: string;
  waktuDibuat: string;
}

interface JurnalState {
  entries: JurnalEntry[];
  addEntry: (entry: JurnalEntry) => void;
  removeEntry: (id: string) => void;
  setAllEntries: (entries: JurnalEntry[]) => void;
}

export const useJurnalStore = create<JurnalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set((state) => {
        const updated = [entry, ...state.entries].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        return { entries: updated };
      }),
      removeEntry: (id) => set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      setAllEntries: (entries) => set({ entries }),
    }),
    {
      name: 'jurnal-storage',
    }
  )
);
