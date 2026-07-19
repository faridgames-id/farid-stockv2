import React, { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Package, Wallet } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import type { AccountItem } from '../store/useInventoryStore';
import { ParallaxCard } from '../components/ui/parallax-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const KalenderKeuangan: React.FC = () => {
  const { accounts } = useInventoryStore();
  const { globalMonth, globalYear, setCurrentView, setGlobalSearch, setHighlightAccountId } = useAppStore();

  const currentYear = globalYear === 'Semua' ? new Date().getFullYear() : parseInt(globalYear);
  const currentMonth = useMemo(() => {
    if (globalMonth === 'Semua') return new Date().getMonth();
    const map: Record<string, number> = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5,
      "Jul": 6, "Agu": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11
    };
    return map[globalMonth] ?? new Date().getMonth();
  }, [globalMonth]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const calendarDays = useMemo(() => {
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let d = 1; d <= numDays; d++) days.push(d);
    return days;
  }, [currentYear, currentMonth]);

  const parseDateFlexible = (dateStr?: string) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    return null;
  };

  const dayTransactions = useMemo(() => {
    const map: { [key: number]: { item: AccountItem, type: 'Beli' | 'Jual' }[] } = {};
    accounts.forEach((acc) => {
      if (acc.tanggalMasuk) {
        const d = parseDateFlexible(acc.tanggalMasuk);
        if (d && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          const day = d.getDate();
          if (!map[day]) map[day] = [];
          map[day].push({ item: acc, type: 'Beli' });
        }
      }
      if (acc.status === 'Terjual' || acc.status === 'Cicilan') {
        const d = parseDateFlexible(acc.tanggalJual || acc.tanggalMasuk);
        if (d && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          const day = d.getDate();
          if (!map[day]) map[day] = [];
          map[day].push({ item: acc, type: 'Jual' });
        }
      }
    });
    return map;
  }, [accounts, currentYear, currentMonth]);

  // Removed local handlePrevMonth and handleNextMonth


  const selectedTransactions = selectedDay ? (dayTransactions[selectedDay] || []) : [];
  const selectedDateString = selectedDay
    ? `${selectedDay} ${monthNames[currentMonth]} ${currentYear}`
    : 'Pilih tanggal';

  const dateRevenue = selectedTransactions.filter(tx => tx.type === 'Jual').reduce((s, tx) => {
    if (tx.item.status === 'Cicilan') return s + (tx.item.totalDibayar || 0);
    return s + (tx.item.hargaJual || 0);
  }, 0);
  const dateSpending = selectedTransactions.filter(tx => tx.type === 'Beli').reduce((s, tx) => s + (tx.item.hargaBeli || 0), 0);
  const dateProfit = selectedTransactions.filter(tx => tx.type === 'Jual').reduce((s, tx) => s + (tx.item.hargaJual - tx.item.hargaBeli), 0);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const todayDate = isCurrentMonth ? today.getDate() : null;

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2.5 border-b border-slate-800/60 pb-3"
      >
        <motion.div 
          initial={{ y: -40, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0 }} 
          className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
        >
          <CalendarDays className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
        <div className="flex flex-col justify-center pt-1">
          <h2 className="text-xl font-display font-bold text-white tracking-tight leading-none">Kalender Keuangan</h2>
          <p className="text-slate-500 text-sm -mt-2.5 font-sans">Pantau status modal masuk dan tanggal laku terjual dalam grid bulanan</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Calendar Grid ── */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <ParallaxCard className="h-full" intensity={5}>
            <div className="bg-[#0a0f1e]/98 border border-slate-700/60 p-7 rounded-3xl space-y-6 relative overflow-hidden group h-full"
              style={{ boxShadow: '0 0 0 1px rgba(148,163,184,0.05), 0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(148,163,184,0.08)' }}
            >

              {/* Subtle ambient glow top-right */}
              <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl" />

              {/* Month Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-white text-2xl tracking-tight leading-none">
                    {monthNames[currentMonth]}
                  </h3>
                  <span className="text-slate-500 text-sm font-sans font-medium">{currentYear}</span>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1.5">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`e-${idx}`} className="aspect-square" />;
                  }

                  const dailyTx = dayTransactions[day] || [];
                  const hasTx = dailyTx.length > 0;
                  const isSelected = selectedDay === day;
                  const isToday = todayDate === day;

                  return (
                    <motion.button
                      key={`day-${day}`}
                      onClick={() => setSelectedDay(day)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-150 cursor-pointer font-sans text-sm font-semibold
                        ${isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50'
                          : hasTx
                          ? 'bg-blue-500/10 border border-blue-500/25 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/40'
                          : isToday
                          ? 'bg-slate-800 border border-slate-600/80 text-slate-200 ring-1 ring-slate-500/50'
                          : 'bg-slate-800/50 border border-slate-800/40 text-slate-500 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                        }`}
                    >
                      <span className={`leading-none ${isSelected ? 'font-bold' : ''}`}>{day}</span>

                      {/* Transaction dot */}
                      {hasTx && (
                        <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white/80' : 'bg-blue-400'}`} />
                      )}

                      {/* Today ring */}
                      {isToday && !isSelected && (
                        <span className="absolute inset-0 rounded-xl ring-1 ring-slate-400/30 pointer-events-none" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 pt-1 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500/40 border border-blue-500/40" />
                  <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Ada transaksi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700" />
                  <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Terpilih</span>
                </div>
              </div>
            </div>
          </ParallaxCard>
        </motion.div>

        {/* ── Detail Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <ParallaxCard className="h-full" intensity={5}>
            <div className="bg-[#0a0f1e]/98 border border-slate-700/60 p-6 rounded-3xl relative overflow-hidden group h-full flex flex-col"
              style={{ boxShadow: '0 0 0 1px rgba(148,163,184,0.05), 0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(148,163,184,0.08)' }}
            >

              {/* Ambient glow */}
              <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-600/10 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-600/10 blur-[80px]" />

              {/* Header */}
              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.2em]">Ringkasan Tanggal</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={selectedDateString}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-slate-400 text-3xl tracking-tight"
                  >
                    {selectedDateString}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {selectedTransactions.length > 0 ? (
                  <motion.div
                    key="has-data"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5 flex-1 relative z-10"
                  >
                    {/* Stats grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: 'Pengeluaran', value: `Rp ${dateSpending.toLocaleString('id-ID')}`, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]', iconColor: 'text-rose-400', iconBg: 'bg-rose-500/20 border-rose-500/30' },
                        { label: 'Pemasukan', value: `Rp ${dateRevenue.toLocaleString('id-ID')}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20 border-emerald-500/30' },
                        { label: 'Profit Bersih', value: `Rp ${dateProfit.toLocaleString('id-ID')}`, color: 'text-blue-400', bg: 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]', highlight: true, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20 border-blue-500/30' },
                      ].map(({ label, value, color, bg, iconColor, iconBg, highlight }) => (
                        <div key={label} className={`flex justify-between items-center px-4 py-3.5 rounded-2xl border ${bg}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`p-1.5 rounded-lg border ${iconBg}`}>
                              <Wallet className={`w-4 h-4 ${iconColor}`} />
                            </div>
                            <span className={`text-xs font-medium tracking-wide ${highlight ? 'text-blue-200/70' : 'text-slate-400'}`}>{label}</span>
                          </div>
                          <span className={`text-base font-black ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-2" />

                    {/* Items list */}
                    <div className="space-y-3 pb-4">
                      {selectedTransactions.map((tx, idx) => (
                        <motion.div
                          key={`${tx.item.id}-${tx.type}-${idx}`}
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                          className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-2 transition-all duration-300 cursor-pointer hover:border-blue-500/50 shadow-sm hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg border ${
                                tx.type === 'Beli'
                                  ? 'bg-rose-500/10 border-rose-500/30'
                                  : 'bg-emerald-500/10 border-emerald-500/30'
                              }`}>
                                <Package className={`w-3.5 h-3.5 ${tx.type === 'Beli' ? 'text-rose-400' : 'text-emerald-400'}`} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-display font-bold text-slate-200 text-sm tracking-wide">{tx.item.id}</span>
                                <span className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">{tx.item.game}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                              tx.type === 'Beli'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {tx.type === 'Beli' ? 'BELI' : 'TERJUAL'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center ml-9 mt-1 border-t border-slate-700/30 pt-2.5">
                            <span className="text-[10px] font-medium text-slate-500 tracking-wide truncate max-w-[140px]">{tx.item.spec}</span>
                            <span className={`text-[12px] font-black ${tx.type === 'Beli' ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {tx.type === 'Jual' 
                                ? `+ Rp ${(tx.item.status === 'Cicilan' ? (tx.item.totalDibayar || 0) : tx.item.hargaJual).toLocaleString('id-ID')}` 
                                : `- Rp ${tx.item.hargaBeli.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-3 py-8"
                  >
                    {/* Empty state icon */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs font-semibold">Tidak ada transaksi</p>
                      <p className="text-slate-700 text-[10px] mt-0.5">pada tanggal ini</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ParallaxCard>
        </motion.div>

      </div>
    </div>
  );
};

export default KalenderKeuangan;
