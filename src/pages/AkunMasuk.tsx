import React, { useState, useMemo } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight, Package, Wallet, Gamepad2 } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import type { AccountItem } from '../store/useInventoryStore';
import { ParallaxCard } from '../components/ui/parallax-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const AkunMasuk: React.FC = () => {
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

  const dayAccounts = useMemo(() => {
    const map: { [key: number]: AccountItem[] } = {};
    accounts.forEach((acc) => {
      const d = parseDateFlexible(acc.tanggalMasuk);
      if (d && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(acc);
      }
    });
    return map;
  }, [accounts, currentYear, currentMonth]);

  // Removed local handlePrevMonth and handleNextMonth


  const selectedEntries = selectedDay ? (dayAccounts[selectedDay] || []) : [];
  const selectedDateString = selectedDay
    ? `${selectedDay} ${monthNames[currentMonth]} ${currentYear}`
    : 'Pilih tanggal';

  const selectedFFCount = selectedEntries.filter(a => a.game === 'Free Fire').length;
  const selectedMLCount = selectedEntries.filter(a => a.game === 'Mobile Legends').length;
  const totalModalSpend = selectedEntries.reduce((s, a) => s + a.hargaBeli, 0);

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
          initial={{ x: -40, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0 }} 
          className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
        >
          <CalendarPlus className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-display font-bold text-white tracking-tight leading-none">Akun Masuk Harian</h2>
          <p className="text-slate-500 text-xs -mt-2.5 font-sans">Riwayat kronologis penambahan stok inventaris harian dalam grid bulanan</p>
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

              {/* Ambient glow */}
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
                  if (day === null) return <div key={`e-${idx}`} className="aspect-square" />;

                  const dailyAccs = dayAccounts[day] || [];
                  const hasAccs = dailyAccs.length > 0;
                  const isSelected = selectedDay === day;
                  const isToday = todayDate === day;
                  const dailyFF = dailyAccs.filter(a => a.game === 'Free Fire').length;
                  const dailyML = dailyAccs.filter(a => a.game === 'Mobile Legends').length;

                  return (
                    <motion.button
                      key={`day-${day}`}
                      onClick={() => setSelectedDay(day)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative cursor-pointer font-sans text-sm font-semibold transition-colors duration-150
                        ${isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50'
                          : hasAccs
                          ? 'bg-blue-500/10 border border-blue-500/25 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/40'
                          : isToday
                          ? 'bg-slate-800 border border-slate-600/80 text-slate-200'
                          : 'bg-slate-800/50 border border-slate-800/40 text-slate-500 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                        }`}
                    >
                      <span className={`leading-none text-xs ${isSelected ? 'font-bold' : ''}`}>{day}</span>

                      {/* Game labels */}
                      {hasAccs && (
                        <div className="flex flex-col items-center -space-y-px">
                          {dailyFF > 0 && (
                            <span className={`text-[7px] font-black leading-none ${isSelected ? 'text-white/80' : 'text-amber-400'}`}>
                              {dailyFF}FF
                            </span>
                          )}
                          {dailyML > 0 && (
                            <span className={`text-[7px] font-black leading-none ${isSelected ? 'text-white/80' : 'text-blue-300'}`}>
                              {dailyML}ML
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 pt-1 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500/40 border border-blue-500/40" />
                  <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Ada stok masuk</span>
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
                {selectedEntries.length > 0 ? (
                  <motion.div key="has-data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5 flex-1 relative z-10">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center px-4 py-3.5 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 shadow-inner">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-700/50 rounded-lg">
                            <Package className="w-4 h-4 text-slate-300" />
                          </div>
                          <span className="text-xs text-slate-400 font-medium tracking-wide">Total Masuk</span>
                        </div>
                        <span className="text-base font-black text-white">{selectedEntries.length} <span className="text-xs text-slate-500 font-semibold uppercase">Akun</span></span>
                      </div>
                      
                      <div className="flex justify-between items-center px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
                            <Wallet className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-xs text-blue-200/70 font-medium tracking-wide">Total Modal (Beli)</span>
                        </div>
                        <span className="text-base font-black text-blue-400">Rp {totalModalSpend.toLocaleString('id-ID')}</span>
                      </div>

                      {/* Game breakdown */}
                      {(selectedFFCount > 0 || selectedMLCount > 0) && (
                        <div className="flex gap-3 pt-1">
                          {selectedFFCount > 0 && (
                            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                              <span className="text-xs font-black text-amber-400 tracking-wider">{selectedFFCount} FF</span>
                            </div>
                          )}
                          {selectedMLCount > 0 && (
                            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]">
                              <span className="text-xs font-black text-blue-400 tracking-wider">{selectedMLCount} ML</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-2" />

                    {/* Items list */}
                    <div className="space-y-3 pb-4">
                      {selectedEntries.map((acc) => (
                        <motion.div 
                          key={acc.id}
                          onClick={() => {
                            setHighlightAccountId(acc.id);
                            setGlobalSearch(acc.id);
                            setCurrentView(acc.game === 'Free Fire' ? 'stok_ff' : 'stok_ml');
                          }} 
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                          className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-2 transition-all duration-300 cursor-pointer hover:border-blue-500/50 shadow-sm hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg border ${
                                acc.game === 'Free Fire' 
                                  ? 'bg-amber-500/10 border-amber-500/30' 
                                  : 'bg-blue-500/10 border-blue-500/30'
                              }`}>
                                <Gamepad2 className={`w-3.5 h-3.5 ${acc.game === 'Free Fire' ? 'text-amber-400' : 'text-blue-400'}`} />
                              </div>
                              <span className="font-display font-bold text-slate-200 text-sm tracking-wide">{acc.id}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                              acc.game === 'Free Fire'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {acc.game === 'Free Fire' ? 'FF' : 'ML'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400/90 leading-relaxed line-clamp-2 ml-9" title={acc.spec}>{acc.spec}</p>
                          <div className="flex justify-between items-center ml-9 mt-1 border-t border-slate-700/30 pt-2.5">
                            <span className="text-[10px] font-medium text-slate-500 tracking-wide">{acc.rank} • {acc.device}</span>
                            <span className="text-[12px] font-black text-emerald-400">Rp {acc.hargaBeli.toLocaleString('id-ID')}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="no-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                      <CalendarPlus className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs font-semibold">Tidak ada stok masuk</p>
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

export default AkunMasuk;
