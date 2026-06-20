import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Sparkles, PlusCircle, ArrowRight, BarChart3, TrendingUp, DollarSign, Wallet, ShieldAlert, Award, Inbox, X, Gamepad2, CheckCircle, Package, Clock } from 'lucide-react';
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
};

const iconPopVariants = {
  initial: { scale: 0, rotate: -15 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 400, damping: 18, delay: 0.3, bounce: 0.6 },
  },
};

// Universal glow class
const glowCard = 'transition-all duration-300 border border-slate-800/80 spotlight-effect relative overflow-hidden group';

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

  // 2. Financial Metrics
  const totalModal = accounts.reduce((sum, acc) => sum + acc.hargaBeli, 0);
  const totalTerjualUang = accounts.filter(acc => acc.status === 'Terjual').reduce((sum, acc) => sum + acc.hargaJual, 0);
  const netProfit = accounts.filter(acc => acc.status === 'Terjual').reduce((sum, acc) => sum + (acc.hargaJual - acc.hargaBeli), 0);
  const potensiProfit = accounts.filter(acc => acc.status !== 'Terjual').reduce((sum, acc) => {
    const target = acc.targetJual || acc.hargaJual;
    return sum + (target - acc.hargaBeli);
  }, 0);

  const metricCards = [
    { label: 'Total Akun FF', value: totalAkunFF, subtitle: 'Semua Status', badge: 'Game', icon: Gamepad2, color: 'from-blue-600 to-blue-800' },
    { label: 'FF Ready', value: ffReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'from-blue-800 to-slate-900' },
    { label: 'Total Akun ML', value: totalAkunML, subtitle: 'Semua Status', badge: 'Game', icon: Gamepad2, color: 'from-blue-600 to-blue-800' },
    { label: 'ML Ready', value: mlReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'from-blue-800 to-slate-900' },
    { label: 'Total Semua', value: totalSemuaAkun, subtitle: 'Seluruh Akun', badge: 'All', icon: Package, color: 'from-indigo-600 to-blue-800' },
    { label: 'Semua Ready', value: semuaReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'from-indigo-800 to-slate-900' },
    { label: 'Terjual', value: totalTerjualVal, subtitle: 'Sukses Terjual', badge: 'Sales', icon: DollarSign, color: 'from-blue-500 to-blue-700' },
    { label: 'Cicilan', value: totalCicilanVal, subtitle: 'Pending Payment', badge: 'Hold', icon: Clock, color: 'from-blue-800 to-slate-900' },
  ];

  return (
    <div className="space-y-8 pb-12 relative">
      <AnimatePresence>
        {isAddMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => setIsAddMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 p-7 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 -mt-24 -mr-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-display font-bold tracking-tight">Pilih Jenis Akun</h3>
                  <p className="text-sm text-blue-200 mt-1 font-sans">Pilih kategori stok inventaris</p>
                </div>
                <button onClick={() => setIsAddMenuOpen(false)} className="text-blue-200 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 relative z-10">
                <button
                  onClick={() => { setCurrentView('stok_ff'); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-400/40 transition-all duration-300 group cursor-pointer shadow-inner"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 shadow-inner shadow-white/30 flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">FF</div>
                  <div className="text-left">
                    <div className="font-display font-bold text-white transition-colors text-lg leading-tight tracking-tight">Akun Free Fire</div>
                    <div className="text-[11px] font-sans text-blue-200 mt-0.5 transition-colors">Tambah stok untuk Free Fire</div>
                  </div>
                </button>
                <button
                  onClick={() => { setCurrentView('stok_ml'); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-400/40 transition-all duration-300 group cursor-pointer shadow-inner"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 shadow-inner shadow-white/30 flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">ML</div>
                  <div className="text-left">
                    <div className="font-display font-bold text-white transition-colors text-lg leading-tight tracking-tight">Akun Mobile Legends</div>
                    <div className="text-[11px] font-sans text-blue-200 mt-0.5 transition-colors">Tambah stok untuk Mobile Legends</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Banners ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Welcome Banner */}
        <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-lg relative overflow-hidden text-white border border-blue-500/30 h-full transition-all duration-300 spotlight-effect group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    onClick={() => setIsAddMenuOpen(true)}
                    className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:bg-gradient-to-r hover:from-white hover:to-blue-50 transition-all duration-300 cursor-pointer group"
                  >
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
                    <span className="whitespace-nowrap">Tambah Akun Baru</span>
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
            <div className="bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col h-full transition-all duration-300 spotlight-effect relative overflow-hidden group">
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
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          variants={itemVariants}
          onClick={() => setCurrentView('stok_ff')}
          whileHover={{ y: -3 }}
          className={`bg-slate-900 rounded-2xl p-6 cursor-pointer group ${glowCard}`}
        >
          <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
            Stok Free Fire
            <motion.div variants={iconPopVariants} initial="initial" animate="animate">
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </motion.div>
          </h3>
          <p className="text-slate-400 text-sm">
            Total {totalAkunFF} akun terdaftar. Klik untuk kelola stok FF.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          onClick={() => setCurrentView('stok_ml')}
          whileHover={{ y: -3 }}
          className={`bg-slate-900 rounded-2xl p-6 cursor-pointer group ${glowCard}`}
        >
          <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
            Stok Mobile Legends
            <motion.div variants={iconPopVariants} initial="initial" animate="animate">
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </motion.div>
          </h3>
          <p className="text-slate-400 text-sm">
            Total {totalAkunML} akun terdaftar. Klik untuk kelola stok ML.
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
            whileHover={{ y: -4, scale: 1.02 }}
            className={`bg-gradient-to-br ${card.color} border border-blue-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 shadow-inner flex items-center justify-center backdrop-blur-sm">
                <card.icon className="w-5 h-5 text-blue-100" />
              </div>
              <div className="px-2 py-1 rounded-full bg-blue-400/20 text-blue-200 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                {card.badge}
              </div>
            </div>
            
            <div className="relative z-10">
              <h4 className="text-xs text-blue-200 font-semibold mb-1 uppercase tracking-wider">{card.label}</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white leading-none">{card.value}</span>
              </div>
              <p className="text-[10px] text-blue-300 mt-1.5 opacity-80">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Statistik Keuangan ── */}
      <div className="relative rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-xl rounded-bl-xl p-[1.2px] bg-gradient-to-r from-blue-600 via-blue-400 to-white/20 shadow-2xl shadow-blue-950/20">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-tl-[1.95rem] rounded-br-[1.95rem] rounded-tr-[11px] rounded-bl-[11px] p-6 pt-8 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-blue-600/80 via-blue-500/70 to-indigo-600/80 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-blue-100 rounded-full shadow-lg shadow-blue-900/40 flex items-center gap-2 z-10 whitespace-nowrap border border-blue-400/30">
            <motion.div variants={iconPopVariants} initial="initial" animate="animate">
              <Wallet className="w-3.5 h-3.5 text-blue-200" />
            </motion.div>
            Statistik Keuangan
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: 'TOTAL MODAL', value: `Rp ${totalModal.toLocaleString('id-ID')}`, subtitle: 'Keseluruhan Modal', badge: 'Capital' },
              { label: 'TOTAL TERJUAL', value: `Rp ${totalTerjualUang.toLocaleString('id-ID')}`, subtitle: 'Pemasukan Kotor', badge: 'Revenue' },
              { label: 'PROFIT/LOSS', value: `${netProfit >= 0 ? '+' : '-'} Rp ${Math.abs(netProfit).toLocaleString('id-ID')}`, subtitle: 'Keuntungan Bersih', badge: 'Profitabilitas' },
              { label: 'POTENSI PROFIT', value: `Rp ${potensiProfit.toLocaleString('id-ID')}`, subtitle: 'Estimasi Masa Depan', badge: 'Forecast' },
            ].map((card) => (
              <motion.div
                key={card.label}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-blue-900/80 to-slate-900 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</h4>
                  <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase">
                    {card.badge}
                  </div>
                </div>
                
                <div>
                  <span className="text-2xl font-black text-white tracking-tight block mb-1.5">{card.value}</span>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> {card.subtitle}
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
          {/* Main Line Chart Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className={`bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6 ${glowCard}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tren Penjualan Mingguan</span>
                  <h4 className="text-2xl font-black text-white mt-1">Rp {totalTerjualUang.toLocaleString('id-ID')}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +14.2% Bulan Ini
                </div>
              </div>

              <div className="w-full h-48 relative">
                <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeDasharray="4 4" />
                  <path d="M 0 160 Q 75 80 150 120 T 300 70 T 450 40 L 500 40 L 500 200 L 0 200 Z" fill="url(#chartGrad)" />
                  <path d="M 0 160 Q 75 80 150 120 T 300 70 T 450 40 L 500 40" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <circle cx="150" cy="120" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="375" cy="55" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
                <span>Jun 11</span><span>Jun 12</span><span>Jun 13</span>
                <span>Jun 14</span><span>Jun 15</span><span>Jun 16</span><span>Jun 17</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Donut Chart Card */}
            <div className={`bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-between text-center gap-4 ${glowCard}`}>
              <div className="w-full text-left">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Progress Target Jual</span>
              </div>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="52" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="52" stroke="#2563eb" strokeWidth="10" fill="transparent"
                    strokeDasharray="326.7" 
                    strokeDashoffset={326.7 - (326.7 * (totalTerjualVal / (totalSemuaAkun || 1)))} 
                    strokeLinecap="round"
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
            <div className={`bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4 ${glowCard}`}>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Alokasi Finansial</span>
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Pembelian Stok</span>
                    <span className="text-white">Rp {totalModal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      className="bg-blue-600 h-full rounded-full"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Estimasi Keuntungan</span>
                    <span className="text-blue-400">Rp {netProfit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                      className="bg-cyan-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>


      {/* ── Advanced Analytics Section ── */}
      <div className="space-y-6 pt-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <motion.div variants={iconPopVariants} initial="initial" animate="animate">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </motion.div>
          Analytics Lanjutan
        </h3>

        {/* Row 1: Bar Chart + Pie + Mini Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Distribusi Game Bar Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group spotlight-effect">
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Distribusi Stok per Game</span>
                  <h4 className="text-xl font-black text-white mt-0.5">Free Fire vs Mobile Legends</h4>
                </div>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>Free Fire</span>
                  <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>Mobile Legends</span>
                </div>
              </div>
              {/* Bar Chart SVG */}
              <div className="w-full h-48">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="ffGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="mlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#4338ca" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0,45,90,135].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="4 4" />
                  ))}
                  {/* Bars - Ready */}
                  <rect x="30" y="60" width="38" height="100" rx="4" fill="url(#ffGrad)" />
                  <rect x="75" y="80" width="38" height="80" rx="4" fill="url(#mlGrad)" />
                  {/* Terjual */}
                  <rect x="165" y="30" width="38" height="130" rx="4" fill="url(#ffGrad)" />
                  <rect x="210" y="50" width="38" height="110" rx="4" fill="url(#mlGrad)" />
                  {/* Cicilan */}
                  <rect x="300" y="90" width="38" height="70" rx="4" fill="url(#ffGrad)" />
                  <rect x="345" y="110" width="38" height="50" rx="4" fill="url(#mlGrad)" />
                  {/* Total */}
                  <rect x="435" y="20" width="38" height="140" rx="4" fill="url(#ffGrad)" opacity="0.7" />
                  {/* Labels */}
                  {["Ready","Terjual","Cicilan","Total"].map((label, i) => (
                    <text key={label} x={72 + i * 135} y="175" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">{label}</text>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Status Distribution Pie/Ring */}
          <motion.div variants={itemVariants}>
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden group spotlight-effect">
              <div className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl" />
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Status Akun</span>
                <h4 className="text-xl font-black text-white mt-0.5">Distribusi Status</h4>
              </div>
              {/* Ring Chart */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Ready segment */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="14" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#3b82f6" strokeWidth="14"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * (semuaReady / (totalSemuaAkun || 1)))}
                    strokeLinecap="butt" />
                  {/* Terjual segment */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#6366f1" strokeWidth="14"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * (totalTerjualVal / (totalSemuaAkun || 1)))}
                    strokeLinecap="butt"
                    style={{transform: `rotate(${(semuaReady / (totalSemuaAkun || 1)) * 360}deg)`, transformOrigin: '60px 60px'}} />
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
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>Terjual</span>
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

        {/* Row 2: KPI Cards Row (like reference image) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: 'Total Keuntungan',
              subtitle: 'Profit dari Terjual',
              value: `Rp ${netProfit.toLocaleString('id-ID')}`,
              badge: netProfit >= 0 ? '+Profit' : 'Loss',
              badgeColor: netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400',
              trendText: 'vs bulan lalu',
              trendColor: 'text-emerald-400',
              borderColor: 'border-blue-500/30',
            },
            {
              label: 'Akun Terjual',
              subtitle: 'Total unit terjual',
              value: totalTerjualVal.toString(),
              badge: 'Sales',
              badgeColor: 'bg-blue-500/20 text-blue-400',
              trendText: 'unit berhasil terjual',
              trendColor: 'text-blue-400',
              borderColor: 'border-blue-500/30',
            },
            {
              label: 'Rata-rata Margin',
              subtitle: 'Per akun terjual',
              value: totalTerjualVal > 0 ? `Rp ${Math.round(netProfit / totalTerjualVal).toLocaleString('id-ID')}` : 'Rp 0',
              badge: 'Margin',
              badgeColor: 'bg-indigo-500/20 text-indigo-400',
              trendText: 'margin bersih per unit',
              trendColor: 'text-indigo-400',
              borderColor: 'border-indigo-500/30',
            },
            {
              label: 'Performa Sistem',
              subtitle: 'Status operasional',
              value: 'EXCELLENT',
              badge: 'Live',
              badgeColor: 'bg-emerald-500/20 text-emerald-400',
              trendText: 'semua sistem berjalan',
              trendColor: 'text-emerald-400',
              borderColor: 'border-emerald-500/30',
              highlight: true,
            },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-gradient-to-br from-slate-900 to-slate-950 border ${kpi.borderColor} p-6 rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg`}
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent opacity-60"></div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{kpi.label}<br /><span className="text-slate-600 normal-case tracking-normal">{kpi.subtitle}</span></p>
                <div className={`px-2 py-1 rounded-full text-[9px] font-bold ${kpi.badgeColor}`}>{kpi.badge}</div>
              </div>
              <p className={`text-2xl font-black tracking-tight ${kpi.highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400' : 'text-white'}`}>{kpi.value}</p>
              <p className={`text-[10px] mt-2 ${kpi.trendColor} font-medium`}>▲ {kpi.trendText}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 3: Profit Timeline Sparklines */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Profit vs Modal Area Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group spotlight-effect">
              <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Profit vs Modal</span>
                  <h4 className="text-xl font-black text-white mt-0.5">Perbandingan Keuangan</h4>
                </div>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-1 rounded-full bg-blue-500 inline-block"></span>Modal</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-1 rounded-full bg-emerald-500 inline-block"></span>Profit</span>
                </div>
              </div>
              <div className="w-full h-44">
                <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Grid */}
                  {[0,40,80,120].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  ))}
                  {/* Modal Area */}
                  <path d="M 0 130 C 60 110 120 90 180 100 S 300 80 360 60 S 440 40 500 30 L 500 160 L 0 160 Z" fill="url(#modalGrad)" />
                  <path d="M 0 130 C 60 110 120 90 180 100 S 300 80 360 60 S 440 40 500 30" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Profit Area */}
                  <path d="M 0 150 C 60 140 120 130 180 135 S 300 120 360 100 S 440 85 500 70 L 500 160 L 0 160 Z" fill="url(#profitGrad)" />
                  <path d="M 0 150 C 60 140 120 130 180 135 S 300 120 360 100 S 440 85 500 70" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Data points */}
                  <circle cx="180" cy="100" r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="360" cy="60" r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="180" cy="135" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <circle cx="360" cy="100" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  {/* X-axis labels */}
                  {["Jan","Feb","Mar","Apr","Mei","Jun"].map((m, i) => (
                    <text key={m} x={40 + i * 88} y="160" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">{m}</text>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Top Metrics Mini Cards */}
          <motion.div variants={itemVariants} className="space-y-4">
            {[
              { label: 'Konversi Stok', value: `${Math.round((totalTerjualVal / (totalSemuaAkun || 1)) * 100)}%`, sub: 'Stok berhasil terjual', color: 'from-blue-600 to-blue-800' },
              { label: 'Nilai Stok Aktif', value: `Rp ${accounts.filter(a => a.status === 'Ready').reduce((s, a) => s + a.hargaBeli, 0).toLocaleString('id-ID')}`, sub: 'Modal belum balik', color: 'from-indigo-600 to-indigo-800' },
              { label: 'Rata-rata Harga Beli', value: totalSemuaAkun > 0 ? `Rp ${Math.round(totalModal / totalSemuaAkun).toLocaleString('id-ID')}` : 'Rp 0', sub: 'Per akun keseluruhan', color: 'from-slate-700 to-slate-900' },
            ].map(item => (
              <div key={item.label} className={`bg-gradient-to-br ${item.color} border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden shadow-lg`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-lg font-black text-white leading-tight">{item.value}</p>
                <p className="text-[10px] text-blue-300 mt-1 opacity-70">{item.sub}</p>
              </div>
            ))}
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
