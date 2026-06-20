import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RefreshCw, BarChart3, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGlobalFilter } from '../hooks/useGlobalFilter';
import PageMotionWrapper, { itemVariants } from '../components/PageMotionWrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const Statistik: React.FC = () => {
  const rawAccounts = useInventoryStore(state => state.accounts);
  const { filterAccounts } = useGlobalFilter();
  const accountsBase = filterAccounts(rawAccounts);

  const [selectedGameFilter, setSelectedGameFilter] = useState<'Semua' | 'FF' | 'ML'>('Semua');
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just Now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    }, 800);
  };

  // Filter accounts by local game dropdown
  const accounts = selectedGameFilter === 'Semua' 
    ? accountsBase 
    : accountsBase.filter(acc => selectedGameFilter === 'FF' ? acc.game === 'Free Fire' : acc.game === 'Mobile Legends');

  // Metrics
  const totalSemua = accounts.length;
  const ffAccounts = accounts.filter(a => a.game === 'Free Fire');
  const mlAccounts = accounts.filter(a => a.game === 'Mobile Legends');
  const totalTerjual = accounts.filter(a => a.status === 'Terjual').length;
  const totalReady = accounts.filter(a => a.status === 'Ready').length;
  const totalCicilan = accounts.filter(a => a.status === 'Cicilan').length;
  const soldPercent = Math.round((totalTerjual / (totalSemua || 1)) * 100);
  const totalModal = accounts.reduce((s, a) => s + a.hargaBeli, 0);
  const totalRevenue = accounts.filter(a => a.status === 'Terjual').reduce((s, a) => s + a.hargaJual, 0);
  const netProfit = accounts.filter(a => a.status === 'Terjual').reduce((s, a) => s + (a.hargaJual - a.hargaBeli), 0);
  const avgMargin = totalTerjual > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const ffReady = ffAccounts.filter(a => a.status === 'Ready').length;
  const mlReady = mlAccounts.filter(a => a.status === 'Ready').length;
  const ffTerjual = ffAccounts.filter(a => a.status === 'Terjual').length;
  const mlTerjual = mlAccounts.filter(a => a.status === 'Terjual').length;

  const ffProfitMargin = ffAccounts.filter(a => a.status === 'Terjual').length > 0
    ? Math.round((ffAccounts.filter(a => a.status === 'Terjual').reduce((s, a) => s + (a.hargaJual - a.hargaBeli), 0) / (ffAccounts.filter(a => a.status === 'Terjual').reduce((s, a) => s + a.hargaJual, 0) || 1)) * 100) : 63;
  const mlProfitMargin = mlAccounts.filter(a => a.status === 'Terjual').length > 0
    ? Math.round((mlAccounts.filter(a => a.status === 'Terjual').reduce((s, a) => s + (a.hargaJual - a.hargaBeli), 0) / (mlAccounts.filter(a => a.status === 'Terjual').reduce((s, a) => s + a.hargaJual, 0) || 1)) * 100) : 79;

  const kpiCards = [
    {
      label: 'Total Penjualan',
      sub: 'Pemasukan kotor terjual',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      badge: '+12.4%',
      badgeColor: 'bg-emerald-500/30 text-emerald-100 border border-emerald-500/20',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-blue-500/60 via-blue-600/50 to-indigo-700/60',
      border: 'border-t-white/20 border-l-white/10 border-r-white/5 border-b-black/20',
      glow: 'shadow-[0_8px_32px_rgba(59,130,246,0.25)]',
      labelColor: 'text-blue-50',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-blue-100/70',
      iconBg: 'bg-white/20 border-white/30 backdrop-blur-md shadow-inner',
      iconColor: 'text-white drop-shadow-sm',
      glowEl: 'bg-blue-300/20',
    },
    {
      label: 'Total Orders',
      sub: 'Akun berhasil terjual',
      value: totalTerjual.toString(),
      badge: '+8.1%',
      badgeColor: 'bg-emerald-500/30 text-emerald-100 border border-emerald-500/20',
      trend: 'up',
      icon: ShoppingCart,
      gradient: 'from-indigo-500/60 via-violet-600/50 to-purple-700/60',
      border: 'border-t-white/20 border-l-white/10 border-r-white/5 border-b-black/20',
      glow: 'shadow-[0_8px_32px_rgba(99,102,241,0.25)]',
      labelColor: 'text-indigo-50',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-indigo-100/70',
      iconBg: 'bg-white/20 border-white/30 backdrop-blur-md shadow-inner',
      iconColor: 'text-white drop-shadow-sm',
      glowEl: 'bg-violet-300/20',
    },
    {
      label: 'Total Stok',
      sub: 'Seluruh akun terdaftar',
      value: totalSemua.toString(),
      badge: '-3.2%',
      badgeColor: 'bg-red-500/30 text-red-100 border border-red-500/20',
      trend: 'down',
      icon: Package,
      gradient: 'from-slate-600/60 via-slate-700/50 to-slate-800/60',
      border: 'border-t-white/20 border-l-white/10 border-r-white/5 border-b-black/20',
      glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
      labelColor: 'text-slate-100',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-slate-300/70',
      iconBg: 'bg-white/15 border-white/20 backdrop-blur-md shadow-inner',
      iconColor: 'text-white drop-shadow-sm',
      glowEl: 'bg-slate-300/10',
    },
    {
      label: 'Profit Bersih',
      sub: 'Keuntungan setelah modal',
      value: `Rp ${netProfit.toLocaleString('id-ID')}`,
      badge: '+21.1%',
      badgeColor: 'bg-emerald-500/30 text-emerald-100 border border-emerald-500/20',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-cyan-500/60 via-teal-600/50 to-blue-700/60',
      border: 'border-t-white/20 border-l-white/10 border-r-white/5 border-b-black/20',
      glow: 'shadow-[0_8px_32px_rgba(6,182,212,0.25)]',
      labelColor: 'text-cyan-50',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-cyan-100/70',
      iconBg: 'bg-white/20 border-white/30 backdrop-blur-md shadow-inner',
      iconColor: 'text-white drop-shadow-sm',
      glowEl: 'bg-cyan-300/15',
    },
  ];

  // Bar chart data (months, static representative data)
  const barData = [
    { label: 'Jan', ff: 30, ml: 45 },
    { label: 'Feb', ff: 45, ml: 35 },
    { label: 'Mar', ff: 60, ml: 55 },
    { label: 'Apr', ff: 80, ml: 70 },
    { label: 'Mei', ff: 55, ml: 90 },
    { label: 'Jun', ff: 70, ml: 60 },
    { label: 'Jul', ff: 90, ml: 75 },
  ];
  const maxBar = 100;

  // Ring chart segments: Ready (blue), Terjual (indigo), Cicilan (slate)
  const r = 52;
  const circ = 2 * Math.PI * r;
  const readyFrac = totalSemua > 0 ? totalReady / totalSemua : 0;
  const terjualFrac = totalSemua > 0 ? totalTerjual / totalSemua : 0;
  const cicilanFrac = totalSemua > 0 ? totalCicilan / totalSemua : 0;
  const readyDash = circ * readyFrac;
  const terjualDash = circ * terjualFrac;

  // Customer growth bubble data
  const bubbles = [
    { label: 'FF', count: ffAccounts.length, size: 80, color: '#3b82f6', x: 60, y: 55 },
    { label: 'ML', count: mlAccounts.length, size: 68, color: '#6366f1', x: 140, y: 65 },
    { label: 'Terjual', count: totalTerjual, size: 52, color: '#0ea5e9', x: 110, y: 30 },
    { label: 'Ready', count: totalReady, size: 44, color: '#1d4ed8', x: 190, y: 50 },
  ];

  return (
    <PageMotionWrapper className="space-y-6 pb-12 select-none">
      <style>{`
        @keyframes glass-shine {
          0% { transform: translateX(-200%) skewX(-25deg); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateX(300%) skewX(-25deg); opacity: 0; }
        }
        @keyframes float-glow {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.5; }
          50% { transform: scale(1.4) translate(-10px, 10px); opacity: 1; }
        }
        .animate-glass-shine {
          animation: glass-shine 2.5s infinite;
        }
        .animate-float-glow {
          animation: float-glow 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Sales Report
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Pemantauan performa inventaris dan ringkasan finansial</p>
        </div>
        <div className="flex gap-3">
          {/* Game Dropdown */}
          <div className="relative">
            <button onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border border-slate-700/50 rounded-xl text-xs font-medium tracking-wide transition-all backdrop-blur-sm">
              <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mr-1">Game</span>
              {selectedGameFilter === 'Semua' ? 'Semua' : selectedGameFilter === 'FF' ? 'Free Fire' : 'Mobile Legends'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-500 ${isGameDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isGameDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl z-20 backdrop-blur-md">
                  {([{ id: 'Semua', label: 'Semua Game' }, { id: 'FF', label: 'Free Fire' }, { id: 'ML', label: 'Mobile Legends' }] as const).map((opt) => (
                    <button key={opt.id} onClick={() => { setSelectedGameFilter(opt.id); setIsGameDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/80 transition-colors">
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── ROW 1: 4 KPI Cards ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <motion.div key={card.label} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-[20px] p-5 border cursor-pointer transition-all duration-300 backdrop-blur-2xl bg-gradient-to-br ${card.gradient} ${card.border} hover:border-white/30 ${card.glow} hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)]`}>
            
            {/* Background Animated Glow */}
            <div className={`absolute -top-8 -right-8 w-28 h-28 ${card.glowEl} rounded-full blur-3xl pointer-events-none transition-all duration-500 opacity-80 group-hover:animate-float-glow group-hover:opacity-100`} />
            
            {/* Looping Shine Sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
              <div className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-glass-shine mix-blend-overlay" />
            </div>

            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br border ${card.iconBg}`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${card.badgeColor}`}>
                {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.badge}
              </div>
            </div>
            <div className="relative z-10">
              <p className={`text-[9px] font-semibold uppercase tracking-[0.15em] mb-1.5 ${card.labelColor}`}>{card.label}</p>
              <p className={`text-xl font-bold tracking-tight leading-none ${card.valueColor}`}>{card.value}</p>
              <p className={`text-[10px] mt-2 ${card.subColor}`}>{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── ROW 2: Bar Chart (center) + Product Statistic Ring (right) ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart — Customer Habits style */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-[0.15em]">Histori Transaksi</span>
                <h4 className="text-base font-semibold text-slate-100 mt-0.5">Volume Akun per Bulan</h4>
              </div>
              <div className="flex gap-4 text-[10px] font-medium">
                <span className="flex items-center gap-1.5 text-blue-400/80"><span className="w-2 h-2 rounded-sm bg-blue-500 inline-block opacity-80" />Free Fire</span>
                <span className="flex items-center gap-1.5 text-indigo-400/80"><span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block opacity-80" />Mobile Legends</span>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="w-full h-52">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="barFF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="barML" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[40, 80, 120, 160].map(y => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="4 4" />
                ))}
                {/* Bars */}
                {barData.map((d, i) => {
                  const slotW = 500 / barData.length;
                  const cx = slotW * i + slotW / 2;
                  const ffH = (d.ff / maxBar) * 150;
                  const mlH = (d.ml / maxBar) * 150;
                  const barW = 18;
                  return (
                    <g key={d.label}>
                      {/* FF bar */}
                      <rect x={cx - barW - 2} y={170 - ffH} width={barW} height={ffH} rx="4" fill="url(#barFF)" />
                      {/* ML bar */}
                      <rect x={cx + 2} y={170 - mlH} width={barW} height={mlH} rx="4" fill="url(#barML)" />
                      {/* Label */}
                      <text x={cx} y="190" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">{d.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Product Statistic — Ring Chart (right column) */}
        <motion.div variants={itemVariants}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col gap-4 relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-600/8 rounded-full blur-3xl" />
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Product Statistic</span>
                <p className="text-[10px] text-slate-600 mt-0.5">Track your product sales</p>
              </div>
            </div>
            {/* Nested Ring Chart */}
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* BG track */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="11" />
                  {/* Ready */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="11"
                    strokeDasharray={`${readyDash} ${circ - readyDash}`} strokeLinecap="round" />
                  {/* Terjual */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#6366f1" strokeWidth="11"
                    strokeDasharray={`${terjualDash} ${circ - terjualDash}`}
                    strokeLinecap="round"
                    style={{ transform: `rotate(${readyFrac * 360}deg)`, transformOrigin: '60px 60px' }} />
                  {/* Inner ring (Cicilan) */}
                  <circle cx="60" cy="60" r="36" fill="none" stroke="#0f172a" strokeWidth="8" />
                  <circle cx="60" cy="60" r="36" fill="none" stroke="#ef4444" strokeWidth="8"
                    strokeDasharray={`${circ * 0.57 * cicilanFrac * 2} ${circ}`} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black text-white">{totalSemua}</span>
                  <span className="text-[9px] text-slate-500 font-bold">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xl font-black text-white">{totalTerjual.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-bold">Products Sales</p>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                  <ArrowUpRight className="w-3 h-3" /> +{soldPercent}%
                </div>
              </div>
            </div>
            {/* Legend list */}
            <div className="space-y-3 border-t border-slate-800 pt-3">
              {[
                { label: 'Free Fire', value: ffAccounts.length, badge: `+${Math.min(99, ffProfitMargin)}%`, color: 'bg-blue-500', badgeColor: 'bg-blue-500/20 text-blue-400' },
                { label: 'Mobile Legends', value: mlAccounts.length, badge: `+${Math.min(99, mlProfitMargin)}%`, color: 'bg-indigo-400', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
                { label: 'Cicilan', value: totalCicilan, badge: `${totalCicilan}x`, color: 'bg-red-400', badgeColor: 'bg-red-500/20 text-red-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} inline-block`} />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.value}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── ROW 3: Area Chart (left) + Customer Growth Bubbles (right) ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Big area chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Volume Transaksi Finansial</span>
                <h4 className="text-xl font-black text-white mt-0.5">Rp {totalRevenue > 0 ? totalRevenue.toLocaleString('id-ID') : (totalModal).toLocaleString('id-ID')}</h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                <Zap className="w-3.5 h-3.5" />
                Live Feed
              </div>
            </div>
            <div className="w-full h-48 relative">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {[40, 80, 120].map(y => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="4 4" />
                ))}
                <path d="M 0 140 C 60 130 100 80 160 100 S 260 50 320 40 T 450 60 L 500 55 L 500 160 L 0 160 Z" fill="url(#areaGrad)" />
                <path d="M 0 140 C 60 130 100 80 160 100 S 260 50 320 40 T 450 60 L 500 55" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                <circle cx="160" cy="100" r="5.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
                <circle cx="320" cy="40" r="5.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
                {/* Tooltip labels */}
                <rect x="140" y="72" width="38" height="20" rx="5" fill="#2563eb" />
                <text x="159" y="86" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{totalReady}</text>
                <rect x="300" y="12" width="38" height="20" rx="5" fill="#2563eb" />
                <text x="319" y="26" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{totalTerjual}</text>
                {/* X axis */}
                {['Jan','Feb','Mar','Apr','Mei','Jun'].map((m, i) => (
                  <text key={m} x={40 + i * 90} y="158" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">{m}</text>
                ))}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Customer Growth / Bubble Chart */}
        <motion.div variants={itemVariants}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col gap-4 relative overflow-hidden">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Customer Growth</span>
              <p className="text-[10px] text-slate-600 mt-0.5">Distribusi akun per kategori</p>
            </div>
            {/* Bubble visualization */}
            <div className="w-full h-40 relative flex-shrink-0">
              <svg viewBox="0 0 240 110" className="w-full h-full">
                {bubbles.map((b) => (
                  <g key={b.label}>
                    <circle cx={b.x} cy={b.y} r={b.size / 2} fill={b.color} fillOpacity="0.2" stroke={b.color} strokeWidth="1.5" />
                    <text x={b.x} y={b.y - 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="900">{b.count}</text>
                    <text x={b.x} y={b.y + 9} textAnchor="middle" fill={b.color} fontSize="7" fontWeight="bold">{b.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            {/* Ranked list */}
            <div className="space-y-2.5 border-t border-slate-800 pt-3 flex-1">
              {[
                { flag: '🎮', label: 'Free Fire', value: ffAccounts.length, pct: Math.round((ffAccounts.length / (totalSemua || 1)) * 100) },
                { flag: '⚔️', label: 'Mobile Legends', value: mlAccounts.length, pct: Math.round((mlAccounts.length / (totalSemua || 1)) * 100) },
                { flag: '✅', label: 'Ready Jual', value: totalReady, pct: Math.round((totalReady / (totalSemua || 1)) * 100) },
                { flag: '💰', label: 'Terjual', value: totalTerjual, pct: soldPercent },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs gap-2">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium flex-shrink-0">
                    <span>{item.flag}</span> {item.label}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── ROW 4: Margin Bars + Estimasi + Avg Margin KPI ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Margin Efficiency */}
        <motion.div variants={itemVariants}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full space-y-4 relative overflow-hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Efisiensi Margin Akun</span>
            <div className="space-y-4">
              {[
                { label: 'Free Fire', pct: ffProfitMargin, color: 'from-blue-600 to-blue-400' },
                { label: 'Mobile Legends', pct: mlProfitMargin, color: 'from-indigo-500 to-blue-400' },
                { label: 'Rata-rata', pct: avgMargin, color: 'from-cyan-500 to-blue-500' },
              ].map(bar => (
                <div key={bar.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{bar.label}</span>
                    <span className="text-white">{bar.pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.pct}%` }}
                      transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                      className={`bg-gradient-to-r ${bar.color} h-full rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Estimasi Keuntungan Bersih — wavy line */}
        <motion.div variants={itemVariants}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full space-y-4 relative overflow-hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Estimasi Keuntungan Bersih</span>
            <div className="h-32 w-full">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                {[30, 60, 90].map(y => (
                  <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                ))}
                <path d="M 0 90 Q 75 20 150 70 T 300 30" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0 105 Q 75 40 150 90 T 300 50" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round" />
                <circle cx="75" cy="45" r="4" fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                <circle cx="150" cy="70" r="4" fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                <circle cx="225" cy="48" r="4" fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                {['Jan','Mar','Jun'].map((m, i) => (
                  <text key={m} x={20 + i * 130} y="118" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">{m}</text>
                ))}
              </svg>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
              <div>
                <p className="text-slate-500 font-bold uppercase text-[9px]">Profit Bersih</p>
                <p className="text-white font-black">Rp {netProfit.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold uppercase text-[9px]">Margin</p>
                <p className="text-emerald-400 font-black">{avgMargin}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rata-rata & Performa */}
        <motion.div variants={itemVariants}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col gap-4 relative overflow-hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Ringkasan Performa</span>
            <div className="grid grid-cols-1 gap-3 flex-1">
              {[
                { label: 'Total Keuntungan', value: `Rp ${netProfit.toLocaleString('id-ID')}`, sub: 'Profit kotor dari Terjual', color: 'from-blue-500/30 to-blue-800/30 border-blue-400/30' },
                { label: 'Akun Terjual', value: `${totalTerjual} unit`, sub: `${soldPercent}% konversi`, color: 'from-indigo-500/30 to-indigo-800/30 border-indigo-400/30' },
                { label: 'Rata-rata Margin', value: `${avgMargin}%`, sub: avgMargin > 15 ? '✅ Profitabilitas Sehat' : '⚠️ Perlu Ditingkatkan', color: 'from-emerald-500/25 to-teal-800/30 border-emerald-400/30' },
                { label: 'Performa Sistem', value: 'EXCELLENT', sub: 'Semua sistem berjalan', color: 'from-blue-500/35 to-violet-700/30 border-blue-400/30', highlight: true },
              ].map(item => (
                <div key={item.label} className={`bg-gradient-to-br ${item.color} border rounded-xl px-4 py-3 flex justify-between items-center`}>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <p className={`text-sm font-black ${(item as any).highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400' : 'text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold">Last Updated: {lastUpdated}</span>
              <button 
                onClick={handleRefresh}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageMotionWrapper>
  );
};

export default Statistik;
