import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { AccountItem } from '../store/useInventoryStore';
import type { JurnalEntry } from '../store/useJurnalStore';
import type { WishlistItem } from '../store/useWishlistStore';

/**
 * Optimized Global Filter Hook
 *
 * Key performance improvements vs previous version:
 * 1. ATOMIC SELECTORS: Each filter state is subscribed individually so the hook
 *    only re-renders when that specific value changes, not on any store update.
 * 2. useMemo on filter FUNCTIONS: The filter functions themselves are memoized
 *    so downstream components that call filterAccounts(rawData) don't get new
 *    function references on every render.
 * 3. Pre-computed searchLower: toLowerCase() is computed once, not per-item.
 *
 * Components using this hook should ALSO wrap their final filtered arrays in
 * useMemo([rawData, filterAccounts]) for maximum efficiency.
 */
export const useGlobalFilter = () => {
  // ── ATOMIC SELECTORS ── each selector is isolated, prevents full re-renders
  const globalSearch = useAppStore((state) => state.globalSearch);
  const globalMonth  = useAppStore((state) => state.globalMonth);
  const globalYear   = useAppStore((state) => state.globalYear);

  // Pre-compute lowercased search once (not per array item)
  const searchLower = useMemo(() => globalSearch.toLowerCase(), [globalSearch]);

  /** Memoized filter for AccountItem arrays */
  const filterAccounts = useMemo(
    () => (accounts: AccountItem[]) => {
      if (!accounts || accounts.length === 0) return [];
      return accounts.filter((acc) => {
        // 1. Search filter
        if (searchLower) {
          const matched =
            acc.id.toLowerCase().includes(searchLower) ||
            acc.spec.toLowerCase().includes(searchLower) ||
            (acc.namaPenjual && acc.namaPenjual.toLowerCase().includes(searchLower)) ||
            (acc.pembeli && acc.pembeli.toLowerCase().includes(searchLower)) ||
            (acc.rank && acc.rank.toLowerCase().includes(searchLower));
          if (!matched) return false;
        }

        // 2. Month filter
        if (globalMonth !== 'Semua') {
          const accMonth =
            acc.bulanMasuk ||
            (acc.tanggalMasuk
              ? new Date(acc.tanggalMasuk).toLocaleString('id-ID', { month: 'short' })
              : '');
          if (accMonth && !accMonth.startsWith(globalMonth)) return false;
        }

        // 3. Year filter
        if (globalYear !== 'Semua') {
          const accYear = acc.tanggalMasuk
            ? new Date(acc.tanggalMasuk).getFullYear().toString()
            : '';
          if (accYear && accYear !== globalYear) return false;
        }

        return true;
      });
    },
    [searchLower, globalMonth, globalYear]
  );

  /** Memoized filter for JurnalEntry arrays */
  const filterJurnal = useMemo(
    () => (entries: JurnalEntry[]) => {
      if (!entries || entries.length === 0) return [];
      return entries.filter((entry) => {
        if (searchLower) {
          const matched =
            entry.kategori.toLowerCase().includes(searchLower) ||
            entry.catatan.toLowerCase().includes(searchLower);
          if (!matched) return false;
        }

        if (globalMonth !== 'Semua') {
          const entryMonth = new Date(entry.tanggal).toLocaleString('id-ID', { month: 'short' });
          if (!entryMonth.startsWith(globalMonth)) return false;
        }

        if (globalYear !== 'Semua') {
          const entryYear = new Date(entry.tanggal).getFullYear().toString();
          if (entryYear !== globalYear) return false;
        }

        return true;
      });
    },
    [searchLower, globalMonth, globalYear]
  );

  /** Memoized filter for WishlistItem arrays */
  const filterWishlist = useMemo(
    () => (items: WishlistItem[]) => {
      if (!items || items.length === 0) return [];
      if (!searchLower) return items; // fast path — no filter
      return items.filter((item) => {
        const matched =
          item.namaBarang.toLowerCase().includes(searchLower) ||
          item.spesifikasi.toLowerCase().includes(searchLower) ||
          item.kategori.toLowerCase().includes(searchLower);
        return matched;
      });
    },
    [searchLower]
  );

  return {
    filterAccounts,
    filterJurnal,
    filterWishlist,
    globalSearch,
    globalMonth,
    globalYear,
  };
};
