import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { LayoutGrid, Sparkles, PlusCircle, ArrowRight, BarChart3, TrendingUp, DollarSign, Wallet, ShieldAlert, Award, Inbox, X, Gamepad2, CheckCircle, Package, Clock, PieChart } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useAppStore } from '../store/useAppStore';
import { useGlobalFilter } from '../hooks/useGlobalFilter';
import { mockAiInsights } from '../data/mock';
import { GlowingShadow } from '../components/ui/glowing-shadow';

// ─────────────────────────────────────────────
// Shared Animation Variants
// ─────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 26, mass: 0.8 } },
};

const iconPopVariants = {
  initial: { scale: 0, rotate: -15 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 400, damping: 18, delay: 0, bounce: 0.6 },
  },
};

const glowCard = 'relative overflow-hidden group neu-flat neu-interactive bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700/30';

const Dashboard: React.FC = () => {
  const { filterAccounts } = useGlobalFilter();
  const rawAccounts = useInventoryStore(state => state.accounts);
  const accounts = filterAccounts(rawAccounts);
  const { setCurrentView, shopName } = useAppStore();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // 1. Inventory Counts
  const totalAkunFF = accounts.filter(acc => acc.game === 'Free Fire').length;
  const ffReady = accounts.filter(acc => acc.game === 'Free Fire' && acc.status === 'Ready').length;
  const totalAkunML = accounts.filter(acc => acc.game === 'Mobile Legends').length;
  const mlReady = accounts.filter(acc => acc.game === 'Mobile Legends' && acc.status === 'Ready').length;
  
  const totalSemuaAkun = accounts.length;
  const semuaReady = accounts.filter(acc => acc.status === 'Ready').length;
  const totalTerjualVal = accounts.filter(acc => acc.status === 'Terjual').length;
  const totalCicilanVal = accounts.filter(acc => acc.status === 'Cicilan').length;

  const ffTerjual = accounts.filter(acc => acc.game === 'Free Fire' && acc.status === 'Terjual').length;
  const mlTerjual = accounts.filter(acc => acc.game === 'Mobile Legends' && acc.status === 'Terjual').length;
  const ffCicilan = accounts.filter(acc => acc.game === 'Free Fire' && acc.status === 'Cicilan').length;
  const mlCicilan = accounts.filter(acc => acc.game === 'Mobile Legends' && acc.status === 'Cicilan').length;

  // 2. Financial Metrics
  const totalModal = accounts.reduce((sum, acc) => sum + acc.hargaBeli, 0);
  const totalTerjualUang = accounts.filter(acc => acc.status === 'Terjual').reduce((sum, acc) => sum + acc.hargaJual, 0);
  const netProfit = accounts.filter(acc => acc.status === 'Terjual').reduce((sum, acc) => sum + (acc.hargaJual - acc.hargaBeli), 0);
  const potensiProfit = accounts.filter(acc => acc.status !== 'Terjual').reduce((sum, acc) => {
    const target = acc.targetJual || acc.hargaJual;
    return sum + (target - acc.hargaBeli);
  }, 0);

  const metricCards = [
    { label: 'Total Akun FF', value: totalAkunFF, subtitle: 'Semua Status', badge: 'Game', icon: Gamepad2, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { label: 'FF Ready', value: ffReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'bg-gradient-to-br from-blue-800 to-indigo-950' },
    { label: 'Total Akun ML', value: totalAkunML, subtitle: 'Semua Status', badge: 'Game', icon: Gamepad2, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { label: 'ML Ready', value: mlReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'bg-gradient-to-br from-blue-800 to-indigo-950' },
    { label: 'Total Semua', value: totalSemuaAkun, subtitle: 'Seluruh Akun', badge: 'All', icon: Package, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { label: 'Semua Ready', value: semuaReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'bg-gradient-to-br from-blue-800 to-indigo-950' },
    { label: 'Terjual', value: totalTerjualVal, subtitle: 'Sukses Terjual', badge: 'Sales', icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { label: 'Cicilan', value: totalCicilanVal, subtitle: 'Pending Payment', badge: 'Hold', icon: Clock, color: 'bg-gradient-to-br from-blue-800 to-indigo-950' },
  ];

  return (
    <div className="space-y-8 pb-12 relative">
      {createPortal(
        <AnimatePresence>
          {isAddMenuOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => setIsAddMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -40, rotateX: -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-[#050b14]/95 backdrop-blur-2xl border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] text-white p-5 sm:p-7 rounded-[24px] sm:rounded-[32px] max-w-[300px] sm:max-w-sm w-[88%] overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none transform-gpu"></div>

              <div className="flex justify-between items-start mb-3 sm:mb-5 relative z-10">
                <div>
                  <h3 className="text-base sm:text-xl font-display font-bold tracking-tight">Pilih Jenis Akun</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 font-sans">Pilih kategori stok inventaris</p>
                </div>
                <button onClick={() => setIsAddMenuOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-all cursor-pointer">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-5 relative z-10">
                <button
                  onClick={() => { setCurrentView('stok_ff'); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-3 sm:gap-5 p-2.5 sm:p-5 rounded-[14px] sm:rounded-[20px] bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_15px_rgba(59,130,246,0.3)] border border-blue-400/20 group cursor-pointer transition-all active:scale-95"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-[10px] sm:rounded-[14px] bg-[#0f172a]/20 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] flex items-center justify-center text-white font-black text-sm sm:text-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">FF</div>
                  <div className="text-left">
                    <div className="font-display font-bold text-white transition-colors text-sm sm:text-lg leading-tight tracking-tight mb-0.5 sm:mb-1">Akun Free Fire</div>
                    <div className="text-[9px] sm:text-[11px] font-sans text-blue-100 transition-colors opacity-90 leading-snug">Tambah stok untuk Free Fire</div>
                  </div>
                </button>
                <button
                  onClick={() => { setCurrentView('stok_ml'); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-3 sm:gap-5 p-2.5 sm:p-5 rounded-[14px] sm:rounded-[20px] bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_15px_rgba(59,130,246,0.3)] border border-blue-400/20 group cursor-pointer transition-all active:scale-95"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-[10px] sm:rounded-[14px] bg-[#0f172a]/20 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] flex items-center justify-center text-white font-black text-sm sm:text-xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">ML</div>
                  <div className="text-left">
                    <div className="font-display font-bold text-white transition-colors text-sm sm:text-lg leading-tight tracking-tight mb-0.5 sm:mb-1">Akun Mobile Legends</div>
                    <div className="text-[9px] sm:text-[11px] font-sans text-blue-100 transition-colors opacity-90 leading-snug">Tambah stok Mobile Legends</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ── Top Banners ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Welcome Banner */}
        <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 border border-blue-500/30 shadow-sm rounded-2xl p-8 relative overflow-hidden text-white h-full transition-all duration-300 group">
            {/* Shine Sweep Effect */}
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1500 ease-in-out z-0" />
            
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none z-0">
              <motion.div variants={iconPopVariants} initial="initial" animate="animate">
                <LayoutGrid className="w-48 h-48" />
              </motion.div>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">Selamat Datang di {shopName}!</h2>
                <p className="text-blue-100 mt-2 max-w-lg leading-relaxed">
                  Platform enterprise Anda berjalan optimal. Berikut ringkasan performa dan akses cepat operasi harian.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 items-center pt-2">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    onClick={() => setIsAddMenuOpen(true)}
                    className="flex items-center gap-2 text-blue-900 px-6 py-3 rounded-xl font-bold bg-white hover:bg-slate-50 shadow-lg shadow-black/10 cursor-pointer group transition-all duration-300"
                  >
                    <PlusCircle className="w-5 h-5 text-blue-900 group-hover:rotate-90 transition-all duration-300 flex-shrink-0" />
                    <span className="whitespace-nowrap tracking-wide">Tambah Akun Baru</span>
                  </motion.button>
                </div>
                <div className="flex gap-6 sm:border-l border-blue-500/30 sm:pl-6">
                  <div>
                    <p className="text-blue-200 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Total Ready</p>
                    <p className="font-display text-2xl font-bold leading-none">{semuaReady}</p>
                  </div>
                  <div className="w-px bg-blue-500/50 block sm:hidden"></div>
                  <div>
                    <p className="text-blue-200 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Total Terjual</p>
                    <p className="font-display text-2xl font-bold leading-none">{totalTerjualVal}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Marketplace AI Banner */}
        <motion.div variants={itemVariants}>
          <GlowingShadow className="h-full rounded-2xl" style={{ '--card-radius': '1rem', '--card-color': '#0f172a' } as React.CSSProperties}>
            <div className="bg-slate-900 neu-flat h-full rounded-2xl p-6 flex flex-col transition duration-300 relative overflow-hidden group">
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <motion.div variants={iconPopVariants} initial="initial" animate="animate">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </motion.div>
                <h3 className="font-display font-bold text-white">Marketplace AI Insight</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">
                "{mockAiInsights.message}"
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800">
                <motion.button 
                  onClick={() => setIsAiModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Lihat Analisis Detail &rarr;
                </motion.button>
              </div>
            </div>
          </GlowingShadow>
        </motion.div>
      </motion.div>

      {/* ── Quick Access Grid ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          onClick={() => setCurrentView('stok_ff')}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-[24px] p-6 cursor-pointer group bg-[#0B1221]/80 backdrop-blur-md border border-slate-800/80 shadow-none hover:border-slate-700 hover:bg-[#0f172a] transition-all duration-300"
        >
          {/* Glossy Shine Effect */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none mix-blend-overlay z-0" />
          {/* Ambient Glows to tint the glass */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-800/15 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-800/25 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-700/10 rounded-full blur-[50px] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),0_4px_8px_rgba(30,58,138,0.15)] group-hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),0_6px_12px_rgba(30,58,138,0.25)] group-hover:-translate-y-0.5 transition-all duration-300">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm">
                Stok Free Fire
              </h3>
            </div>
            <motion.div variants={iconPopVariants} initial="initial" animate="animate" className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-700/20 group-hover:border-blue-700/40 transition-colors shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)]">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          </div>
          <p className="relative z-10 text-slate-400 text-[13px] font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
            Total <span className="font-bold text-blue-400 bg-blue-700/20 px-1.5 py-0.5 rounded-md mx-0.5">{totalAkunFF}</span> akun terdaftar. Klik untuk kelola inventaris.
          </p>
        </motion.div>

        <motion.div
          onClick={() => setCurrentView('stok_ml')}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-[24px] p-6 cursor-pointer group bg-[#0B1221]/80 backdrop-blur-md border border-slate-800/80 shadow-none hover:border-slate-700 hover:bg-[#0f172a] transition-all duration-300"
        >
          {/* Glossy Shine Effect */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none mix-blend-overlay z-0" />
          {/* Ambient Glows to tint the glass */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600/15 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-600/25 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400/10 rounded-full blur-[50px] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),0_4px_8px_rgba(37,99,235,0.15)] group-hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),0_6px_12px_rgba(37,99,235,0.25)] group-hover:-translate-y-0.5 transition-all duration-300">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm">
                Stok Mobile Legends
              </h3>
            </div>
            <motion.div variants={iconPopVariants} initial="initial" animate="animate" className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-colors shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)]">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          </div>
          <p className="relative z-10 text-slate-400 text-[13px] font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
            Total <span className="font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md mx-0.5">{totalAkunML}</span> akun terdaftar. Klik untuk kelola inventaris.
          </p>
        </motion.div>
      </motion.div>

      {/* ── 8-Grid Metric Cards ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`${card.color} p-5 xl:p-6 rounded-[20px] flex flex-col justify-between relative overflow-hidden group cursor-pointer border border-blue-400/30 shadow-none hover:shadow-none transition-all duration-300 min-h-[190px] sm:min-h-[160px]`}
          >
            {/* MOTIF: 3D Glass Background Bubbles */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tl from-white/10 via-white/5 to-transparent rounded-full group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
            <div className="absolute -bottom-6 -right-6 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-white/20 to-transparent rounded-full group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none z-0 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)] border border-white/20" />
            
            <div className="absolute top-6 right-12 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-white/20 to-white/5 rounded-full group-hover:-translate-y-2 group-hover:translate-x-1 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]" />
            
            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10 gap-2">
              <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-[12px] bg-white/10 border border-white/20 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-3px_-3px_7px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-center backdrop-blur-md shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <card.icon className="w-5 h-5 xl:w-6 xl:h-6 text-white drop-shadow-md" />
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-[11px] font-bold shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap">
                {card.badge}
              </div>
            </div>
            
            <div className="relative z-10 space-y-1">
              <h4 className="text-xs text-white/80 font-bold uppercase tracking-wider line-clamp-2 leading-tight">{card.label}</h4>
              <div className="font-display text-3xl sm:text-2xl xl:text-[32px] font-black text-white leading-none tracking-tight">{card.value}</div>
              <p className="text-[11px] text-white/50 pt-1">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Statistik Keuangan ── */}
      <div className="relative rounded-[2rem] p-[1.5px] bg-gradient-to-b from-blue-500/60 via-blue-600/30 to-[#0B1221] mt-8 mb-6">
        <div className="bg-[#0B1221] rounded-[2rem] p-4 sm:p-5 pb-5 sm:pb-6 relative h-full w-full">

          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
            className="flex justify-center relative z-10 mb-5 mt-1"
          >
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative cursor-pointer overflow-hidden px-4 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-[9px] sm:text-[11px] font-display font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white rounded-full flex items-center gap-1.5 sm:gap-2 whitespace-nowrap border border-blue-400/50 max-w-full shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-shadow duration-300"
            >
              {/* Kilau ketika ditekan (Shine on press) */}
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] group-active:translate-x-[150%] transition-transform duration-500 ease-out pointer-events-none z-0" />
              
              <motion.div variants={iconPopVariants} initial="initial" animate="animate" className="shrink-0 relative z-10">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-sm" />
              </motion.div>
              <span className="truncate relative z-10 drop-shadow-sm">Statistik Keuangan</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-20px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1, staggerDirection: -1 }
              }
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-2 relative z-10"
          >
            {[
              { label: 'TOTAL\nMODAL', value: `Rp ${totalModal.toLocaleString('id-ID')}`, subtitle: 'Keseluruhan Modal', badge: 'Capital', grad: 'from-blue-600 to-blue-900', shadowColor: 'rgba(37,99,235,0.4)' },
              { label: 'TOTAL\nTERJUAL', value: `Rp ${totalTerjualUang.toLocaleString('id-ID')}`, subtitle: 'Pemasukan Kotor', badge: 'Revenue', grad: 'from-blue-500 to-indigo-900', shadowColor: 'rgba(59,130,246,0.4)' },
              { label: 'PROFIT/\nLOSS', value: `${netProfit >= 0 ? '+' : '-'} Rp ${Math.abs(netProfit).toLocaleString('id-ID')}`, subtitle: 'Keuntungan Bersih', badge: 'Net Profit', grad: 'from-sky-500 to-blue-900', shadowColor: 'rgba(14,165,233,0.4)' },
              { label: 'POTENSI\nPROFIT', value: `Rp ${potensiProfit.toLocaleString('id-ID')}`, subtitle: 'Estimasi Masa Depan', badge: 'Forecast', grad: 'from-cyan-600 to-indigo-900', shadowColor: 'rgba(8,145,178,0.4)' },
            ].map((card) => (
              <motion.div
                key={card.label}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 30 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 20, bounce: 0.4 } }
                }}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98, y: 0 }}
                className={`bg-gradient-to-br ${card.grad} p-5 sm:p-6 rounded-[20px] flex flex-col justify-between relative group cursor-pointer border border-white/10 overflow-hidden shadow-lg transition-all duration-300`}
              >
                {/* MOTIF: Concentric Ripples / Hollow Rings */}
                <div className="absolute -bottom-16 -right-16 w-64 h-64 border-[1px] border-white/20 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0" />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 border-[2px] border-white/10 rounded-full group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none z-0" />
                <div className="absolute bottom-4 right-4 w-24 h-24 border-[4px] border-white/5 rounded-full group-hover:scale-125 transition-transform duration-300 ease-out pointer-events-none z-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                <div className="absolute -top-12 -left-12 w-32 h-32 border-[1px] border-white/20 rounded-full group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-300 ease-out pointer-events-none z-0 backdrop-blur-[2px]" />

                <div className="flex flex-col xl:flex-row xl:justify-between items-start mb-4 gap-2 relative z-10">
                  <h4 className="text-[11px] sm:text-xs text-blue-100 font-black uppercase tracking-widest leading-tight flex-1 whitespace-pre-line drop-shadow-md">{card.label}</h4>
                  <div className="px-3.5 py-1.5 rounded-full bg-black/20 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest shrink-0 whitespace-nowrap self-start backdrop-blur-sm shadow-sm">
                    {card.badge}
                  </div>
                </div>
                
                <div className="relative z-10 mt-2">
                  <span className="font-display text-xl sm:text-2xl lg:text-[24px] font-black text-white tracking-tight block mb-1 truncate drop-shadow-lg">{card.value}</span>
                  <p className="text-[10px] sm:text-xs text-blue-100/80 flex items-center gap-1.5 font-bold">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 drop-shadow-sm" /> {card.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Business Statistics Charts ── */}
      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <motion.div variants={iconPopVariants} initial="initial" animate="animate">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </motion.div>
          Analisis & Statistik Performa
        </h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Distribusi Game Bar Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className={`rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between lg:h-full ${glowCard}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Distribusi Stok per Game</span>
                  <h4 className="text-xl font-black text-white mt-0.5">Free Fire vs Mobile Legends</h4>
                </div>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 text-blue-500"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block"></span>Free Fire</span>
                  <span className="flex items-center gap-1.5 text-blue-300"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block"></span>Mobile Legends</span>
                </div>
              </div>
              {/* Bar Chart SVG */}
              <div className="w-full h-56 mt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="ffGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                    <linearGradient id="mlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.5"/>
                    </filter>
                  </defs>
                  
                  {/* Grid lines */}
                  {[40, 90, 140].map(y => (
                    <line key={`h-${y}`} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="4 4" opacity="0.6" />
                  ))}

                  {/* Bars & Labels */}
                  {(() => {
                    const maxVal = Math.max(totalAkunFF, totalAkunML, 1);
                    const getH = (val: number) => (val / maxVal) * 120 + 8; // min height 8
                    const getY = (val: number) => 140 - getH(val);
                    
                    const data = [
                      { label: "Ready", ff: ffReady, ml: mlReady },
                      { label: "Terjual", ff: ffTerjual, ml: mlTerjual },
                      { label: "Cicilan", ff: ffCicilan, ml: mlCicilan },
                      { label: "Total", ff: totalAkunFF, ml: totalAkunML },
                    ];

                    return data.map((d, i) => {
                      const baseX = 45 + i * 115;
                      const hFF = getH(d.ff);
                      const yFF = getY(d.ff);
                      const hML = getH(d.ml);
                      const yML = getY(d.ml);
                      
                      return (
                        <g key={d.label}>
                          {/* X-axis label */}
                          <text x={baseX + 22} y="165" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" className="uppercase tracking-wider">{d.label}</text>
                          
                          {/* FF Bar */}
                          <g className="group cursor-pointer">
                            <motion.rect 
                              initial={{ height: 0, y: 140 }}
                              animate={{ height: hFF, y: yFF }}
                              transition={{ duration: 0.8, delay: i * 0.1, type: "spring", stiffness: 100 }}
                              x={baseX} width="20" rx="4" fill="url(#ffGrad)" filter="url(#barGlow)" 
                              className="transition-all duration-300 group-hover:brightness-125"
                            />
                            <motion.rect 
                              initial={{ height: 0, y: 140 }}
                              animate={{ height: hFF, y: yFF }}
                              transition={{ duration: 0.8, delay: i * 0.1, type: "spring", stiffness: 100 }}
                              x={baseX} width="2" rx="1" fill="#ffffff" opacity="0.3" className="pointer-events-none" 
                            />
                            <text x={baseX + 10} y={yFF - 8} textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold" opacity="0" className="group-hover:opacity-100 transition-opacity">{d.ff}</text>
                          </g>

                          {/* ML Bar */}
                          <g className="group cursor-pointer">
                            <motion.rect 
                              initial={{ height: 0, y: 140 }}
                              animate={{ height: hML, y: yML }}
                              transition={{ duration: 0.8, delay: i * 0.1 + 0.05, type: "spring", stiffness: 100 }}
                              x={baseX + 26} width="20" rx="4" fill="url(#mlGrad)" filter="url(#barGlow)"
                              className="transition-all duration-300 group-hover:brightness-125"
                            />
                            <motion.rect 
                              initial={{ height: 0, y: 140 }}
                              animate={{ height: hML, y: yML }}
                              transition={{ duration: 0.8, delay: i * 0.1 + 0.05, type: "spring", stiffness: 100 }}
                              x={baseX + 26} width="2" rx="1" fill="#ffffff" opacity="0.3" className="pointer-events-none" 
                            />
                            <text x={baseX + 36} y={yML - 8} textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold" opacity="0" className="group-hover:opacity-100 transition-opacity">{d.ml}</text>
                          </g>
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="space-y-6 lg:h-full flex flex-col">
            {/* Donut Chart Card */}
            <div className={`rounded-2xl p-6 flex flex-col items-center justify-between text-center gap-4 flex-1 ${glowCard}`}>
              <div className="w-full text-left">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Progress Target Jual</span>
              </div>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible">
                  <defs>
                    <filter id="glowTargetRing" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.6"/>
                    </filter>
                  </defs>
                  <circle cx="64" cy="64" r="52" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                  <motion.circle 
                    cx="64" cy="64" r="52" stroke="#2563eb" strokeWidth="10" fill="transparent"
                    strokeDasharray="326.7" 
                    strokeLinecap="round"
                    filter="url(#glowTargetRing)"
                    initial={{ strokeDashoffset: 326.7 }}
                    whileInView={{ strokeDashoffset: 326.7 - (326.7 * (totalTerjualVal / (totalSemuaAkun || 1))) }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0 }}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">
                    {Math.round((totalTerjualVal / (totalSemuaAkun || 1)) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold">Terjual</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Ready</span>
                  <span className="text-sm font-bold text-white">{semuaReady} Unit</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Terjual</span>
                  <span className="text-sm font-bold text-blue-400">{totalTerjualVal} Unit</span>
                </div>
              </div>
            </div>

            {/* Alokasi Finansial */}
            <div className={`rounded-[24px] p-6 lg:p-7 space-y-6 ${glowCard} relative overflow-hidden group`}>
              {/* Subtle Ambient Background */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-[#0f172a]/50 border border-white/5 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <PieChart className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300 font-bold uppercase tracking-widest block">Alokasi Finansial</span>
              </div>

              <div className="space-y-6 relative z-10">
                {/* Bar 1: Pembelian Stok */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-700 shadow-[0_0_8px_rgba(29,78,216,0.8)]"></span>
                      Pembelian Stok
                    </span>
                    <span className="text-sm font-black text-white tracking-tight drop-shadow-sm">Rp {totalModal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-3 bg-[#0f172a]/80 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0 }}
                      className="bg-gradient-to-r from-blue-700 to-blue-900 h-full rounded-full relative shadow-[0_0_12px_rgba(29,78,216,0.6)]"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse opacity-50 rounded-full"></div>
                    </motion.div>
                  </div>
                </div>

                {/* Bar 2: Estimasi Keuntungan */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                      Estimasi Keuntungan
                    </span>
                    <span className="text-sm font-black text-blue-400 tracking-tight drop-shadow-sm">Rp {netProfit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-3 bg-[#0f172a]/80 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0 }}
                      className="bg-gradient-to-r from-blue-400 to-blue-300 h-full rounded-full relative shadow-[0_0_12px_rgba(96,165,250,0.6)]"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse opacity-50 rounded-full"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Line Chart Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className={`rounded-2xl p-6 flex flex-col justify-between gap-6 lg:h-full ${glowCard}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tren Penjualan Mingguan</span>
                  <h4 className="text-2xl font-black text-white mt-1">Rp {totalTerjualUang.toLocaleString('id-ID')}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +14.2% Bulan Ini
                </div>
              </div>

              <div className="w-full h-48 relative mt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.8"/>
                    </filter>
                  </defs>
                  
                  {/* Grid Lines (Subtle Horizontal Only) */}
                  {[40, 90, 140, 190].map(y => (
                    <line key={`h-${y}`} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="3 4" strokeWidth="1.5" opacity="0.4" />
                  ))}

                  {/* Area Gradient */}
                  <motion.path 
                    d="M 35 200 L 35 130 C 71 130, 71 90, 107 90 C 142.5 90, 142.5 110, 178 110 C 214 110, 214 60, 250 60 C 286 60, 286 80, 322 80 C 357.5 80, 357.5 40, 393 40 C 429 40, 429 20, 465 20 L 465 200 Z" 
                    fill="url(#chartGrad)" 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1, delay: 0 }}
                  />

                  {/* Main Line (Outer Glow) */}
                  <motion.path 
                    d="M 35 130 C 71 130, 71 90, 107 90 C 142.5 90, 142.5 110, 178 110 C 214 110, 214 60, 250 60 C 286 60, 286 80, 322 80 C 357.5 80, 357.5 40, 393 40 C 429 40, 429 20, 465 20" 
                    fill="none" stroke="#3b82f6" strokeWidth="5" filter="url(#lineGlow)" strokeLinecap="round" strokeLinejoin="round" 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Core Line (Inner Brightness) */}
                  <motion.path 
                    d="M 35 130 C 71 130, 71 90, 107 90 C 142.5 90, 142.5 110, 178 110 C 214 110, 214 60, 250 60 C 286 60, 286 80, 322 80 C 357.5 80, 357.5 40, 393 40 C 429 40, 429 20, 465 20" 
                    fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  
                  {/* Glowing Data Points with Glass Tooltips */}
                  {[
                    { cx: 35, cy: 130, val: 12 },
                    { cx: 107, cy: 90, val: 34 },
                    { cx: 178, cy: 110, val: 24 },
                    { cx: 250, cy: 60, val: 48 },
                    { cx: 322, cy: 80, val: 38 },
                    { cx: 393, cy: 40, val: 62 },
                    { cx: 465, cy: 20, val: 84 },
                  ].map((point, i) => (
                    <motion.g 
                      key={`point-${i}`} 
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '100px' }}
                      transition={{ type: "spring", delay: 0 + i * 0.1 }}
                      className="cursor-pointer group origin-center transition-transform duration-300 hover:z-50"
                      style={{ transformOrigin: `${point.cx}px ${point.cy}px` }}
                    >
                      {/* Pulse Ring */}
                      <circle cx={point.cx} cy={point.cy} r="16" fill="#3b82f6" fillOpacity="0.15" className="animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Outer Dark Ring */}
                      <circle cx={point.cx} cy={point.cy} r="6.5" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" className="group-hover:stroke-[#3b82f6] transition-colors duration-300" />
                      
                      {/* Inner Bright Core */}
                      <circle cx={point.cx} cy={point.cy} r="3.5" fill="#60a5fa" />
                      
                      {/* Interactive Glass Tooltip */}
                      <g className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out origin-bottom" style={{ transformOrigin: `${point.cx}px ${point.cy - 12}px` }}>
                        {/* Tooltip Shadow */}
                        <rect x={point.cx - 24} y={point.cy - 44} width="48" height="24" rx="8" fill="#000000" fillOpacity="0.4" filter="blur(6px)" />
                        
                        {/* Tooltip Body */}
                        <rect x={point.cx - 24} y={point.cy - 44} width="48" height="24" rx="8" fill="#0f172a" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" className="backdrop-blur-md" />
                        <text x={point.cx} y={point.cy - 28} fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle" className="font-display tracking-wide drop-shadow-sm">{point.val}</text>
                        
                        {/* Tooltip Pointer (Triangle) */}
                        <polygon points={`${point.cx - 5},${point.cy - 21} ${point.cx + 5},${point.cy - 21} ${point.cx},${point.cy - 15}`} fill="#0f172a" fillOpacity="0.85" />
                        <polyline points={`${point.cx - 5},${point.cy - 21} ${point.cx},${point.cy - 15} ${point.cx + 5},${point.cy - 21}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </motion.g>
                  ))}
                </svg>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-500 px-2 mt-2 font-display uppercase tracking-widest">
                <span>Jan</span><span>Feb</span><span>Mar</span>
                <span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
              </div>
            </div>
          </motion.div>

          {/* Status Distribution Pie/Ring */}
          <motion.div variants={itemVariants}>
            <div className={`rounded-2xl p-6 lg:h-full flex flex-col justify-between relative overflow-hidden ${glowCard}`}>
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Status Akun</span>
                <h4 className="text-xl font-black text-white mt-0.5">Distribusi Status</h4>
              </div>
              {/* Ring Chart */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90 overflow-visible">
                  <defs>
                    <filter id="glowStatusReady" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.6"/>
                    </filter>
                    <filter id="glowStatusTerjual" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#60a5fa" floodOpacity="0.6"/>
                    </filter>
                  </defs>
                  {/* Ready segment */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="12" />
                  <motion.circle cx="60" cy="60" r="48" fill="none" stroke="#3b82f6" strokeWidth="12"
                    strokeDasharray={301.6}
                    strokeLinecap="round" filter="url(#glowStatusReady)"
                    initial={{ strokeDashoffset: 301.6 }}
                    whileInView={{ strokeDashoffset: 301.6 - (301.6 * (semuaReady / (totalSemuaAkun || 1))) }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Terjual segment */}
                  <motion.circle cx="60" cy="60" r="48" fill="none" stroke="#60a5fa" strokeWidth="12"
                    strokeDasharray={301.6}
                    strokeLinecap="round" filter="url(#glowStatusTerjual)"
                    style={{transform: `rotate(${(semuaReady / (totalSemuaAkun || 1)) * 360}deg)`, transformOrigin: '60px 60px'}} 
                    initial={{ strokeDashoffset: 301.6 }}
                    whileInView={{ strokeDashoffset: 301.6 - (301.6 * (totalTerjualVal / (totalSemuaAkun || 1))) }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0 }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{totalSemuaAkun}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Total</span>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Ready</span>
                  <span className="font-bold text-white">{semuaReady}<span className="text-slate-500 font-normal"> unit</span></span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span>Terjual</span>
                  <span className="font-bold text-blue-400">{totalTerjualVal}<span className="text-slate-500 font-normal"> unit</span></span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>Cicilan</span>
                  <span className="font-bold text-slate-300">{totalCicilanVal}<span className="text-slate-500 font-normal"> unit</span></span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>



      </div>

      <AnimatePresence>
        {isAiModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsAiModalOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-900/20 pointer-events-auto overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full translate-y-1/2"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white tracking-tight">AI Market Analysis</h2>
                      <p className="text-xs text-blue-400 font-medium">Powered by FS-Analytics Engine</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAiModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors z-10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-slate-200">Tren Free Fire</h4>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Akun tipe <strong>"Sultan"</strong> dengan skin langka seperti <em>SG Ungu</em> dan <em>Scar Titan</em> sedang mengalami lonjakan permintaan sebesar <strong>24%</strong> minggu ini. Direkomendasikan untuk menaikkan harga jual sebesar 5-10%.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        <h4 className="font-bold text-slate-200">Tren Mobile Legends</h4>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Akun tier <strong>Mythic Glory</strong> dengan <em>Skin Collector/Legend</em> memiliki waktu hold rata-rata hanya <strong>3.2 hari</strong>. Margin profit dapat dimaksimalkan dengan melakukan hold sebentar sebelum event besar MLBB dimulai.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-r from-blue-900/30 to-slate-900 border border-blue-500/20 relative overflow-hidden group">
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-500/10 to-transparent"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="mt-1">
                        <ShieldAlert className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-400 mb-1">Rekomendasi Restock</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Sistem mendeteksi bahwa rasio Stok Ready vs Pesanan Request Anda saat ini sedang tidak seimbang. Segera cari stok <strong>Mobile Legends (Tier Epic/Legend)</strong> dengan harga miring untuk memenuhi permintaan reseller Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
                  <button 
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
                  >
                    Mengerti
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
