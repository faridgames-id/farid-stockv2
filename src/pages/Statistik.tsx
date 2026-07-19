import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RefreshCw, BarChart3, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, Zap, ArrowUpRight, ArrowDownRight, AlertTriangle, Gamepad2, Swords, CheckCircle2, Wallet } from 'lucide-react';
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
      gradient: 'from-cyan-400 to-blue-600',
      border: 'border-cyan-300/30',
      labelColor: 'text-cyan-50',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-sky-100/70',
    },
    {
      label: 'Total Orders',
      sub: 'Akun berhasil terjual',
      value: totalTerjual.toString(),
      badge: '+8.1%',
      badgeColor: 'bg-emerald-500/30 text-emerald-100 border border-emerald-500/20',
      trend: 'up',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-800',
      border: 'border-blue-400/30',
      labelColor: 'text-blue-100',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-blue-100/70',
    },
    {
      label: 'Total Stok',
      sub: 'Seluruh akun terdaftar',
      value: totalSemua.toString(),
      badge: 'All',
      badgeColor: 'bg-blue-500/30 text-blue-100 border border-blue-500/20',
      trend: 'up',
      icon: Package,
      gradient: 'from-sky-400 to-blue-700',
      border: 'border-sky-400/30',
      labelColor: 'text-sky-100',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-indigo-100/70',
    },
    {
      label: 'Profit Bersih',
      sub: 'Est. keuntungan bersih',
      value: `Rp ${netProfit.toLocaleString('id-ID')}`,
      badge: `${avgMargin}%`,
      badgeColor: 'bg-emerald-500/30 text-emerald-100 border border-emerald-500/20',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-teal-400 to-blue-600',
      border: 'border-teal-300/30',
      labelColor: 'text-teal-50',
      valueColor: 'text-white drop-shadow-md',
      subColor: 'text-cyan-100/70',
    }
  ];

  // Generate last 7 months data dynamically based on actual accounts
  const barData = React.useMemo(() => {
    const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const result = [];
    const currentDate = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      result.push({ 
        label: monthsStr[d.getMonth()], 
        year: d.getFullYear(), 
        month: d.getMonth() + 1,
        ff: 0, 
        ml: 0 
      });
    }
    
    accounts.forEach(acc => {
      if (acc.tanggalMasuk) {
        const accDate = new Date(acc.tanggalMasuk);
        const y = accDate.getFullYear();
        const m = accDate.getMonth() + 1;
        
        const target = result.find(r => r.year === y && r.month === m);
        if (target) {
          if (acc.game === 'Free Fire') target.ff++;
          if (acc.game === 'Mobile Legends') target.ml++;
        }
      }
    });
    
    return result;
  }, [accounts]);
  
  const maxBar = Math.max(10, ...barData.map(d => Math.max(d.ff, d.ml)));

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
    { label: 'FF', count: ffAccounts.length, size: 95, color: '#3b82f6', x: 55, y: 55 },
    { label: 'ML', count: mlAccounts.length, size: 82, color: '#6366f1', x: 145, y: 65 },
    { label: 'Terjual', count: totalTerjual, size: 70, color: '#0ea5e9', x: 115, y: 25 },
    { label: 'Ready', count: totalReady, size: 58, color: '#1d4ed8', x: 205, y: 50 },
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0 }} 
            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
          >
            <BarChart3 className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <div className="flex flex-col justify-center pt-1">
            <h2 className="text-xl font-bold text-white tracking-tight leading-none">Sales Report</h2>
            <p className="text-slate-400 text-sm mt-0.5">Pemantauan performa inventaris dan ringkasan finansial</p>
          </div>
        </div>

      </div>

      {/* ── ROW 1: 4 KPI Cards ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {kpiCards.map((card) => (
          <motion.div key={card.label} variants={itemVariants} 
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95, rotate: -1, y: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
            className={`group relative overflow-hidden rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 cursor-pointer bg-gradient-to-br ${card.gradient} border ${card.border || 'border-blue-400/30'} shadow-none hover:shadow-none flex flex-col justify-between min-h-[190px] sm:min-h-[160px]`}>
            
            {/* MOTIF: 3D Glass Background Bubbles */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tl from-white/10 via-white/5 to-transparent rounded-full group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
            <div className="absolute -bottom-6 -right-6 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-white/20 to-transparent rounded-full group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none z-0 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)] border border-white/20" />
            
            <div className="absolute top-6 right-12 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-white/20 to-white/5 rounded-full group-hover:-translate-y-2 group-hover:translate-x-1 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]" />

            <div className="flex justify-between items-start mb-3 sm:mb-6 relative z-10">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] flex items-center justify-center bg-white/10 border border-white/20 shadow-sm group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold ${card.badgeColor} shadow-sm backdrop-blur-sm`}>
                {card.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />}
                {card.badge}
              </div>
            </div>
            <div className="relative z-10 space-y-1">
              <p className={`text-[10px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em] mb-1 sm:mb-1 ${card.labelColor}`}>{card.label}</p>
              <p className={`font-display text-2xl sm:text-2xl font-extrabold tracking-tight leading-none ${card.valueColor}`}>{card.value}</p>
              <p className={`text-[11px] sm:text-xs mt-1 sm:mt-1.5 ${card.subColor}`}>{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── ROW 2: Bar Chart (center) + Product Statistic Ring (right) ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart — Customer Habits style */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-[#0f172a] neu-flat rounded-[24px] p-6 sm:p-8 h-full flex flex-col relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-[0.15em]">Histori Transaksi</span>
                <h4 className="text-base font-semibold text-slate-100 mt-0.5">Volume Akun per Bulan</h4>
              </div>
              <div className="flex gap-4 text-[10px] font-medium">
                <span className="flex items-center gap-1.5 text-blue-500/80"><span className="w-2 h-2 rounded-sm bg-blue-600 inline-block opacity-80" />Free Fire</span>
                <span className="flex items-center gap-1.5 text-blue-300/80"><span className="w-2 h-2 rounded-sm bg-blue-400 inline-block opacity-80" />Mobile Legends</span>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="w-full flex-1 min-h-[208px] mt-2">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="barFF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="barML" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glowBarFF" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.5"/>
                  </filter>
                  <filter id="glowBarML" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#60a5fa" floodOpacity="0.5"/>
                  </filter>
                </defs>
                {/* Grid lines */}
                {[40, 80, 120, 160].map(y => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="4 4" strokeOpacity="0.5" />
                ))}
                {/* Bars */}
                {barData.map((d, i) => {
                  const slotW = 500 / barData.length;
                  const cx = slotW * i + slotW / 2;
                  const ffH = (d.ff / maxBar) * 150;
                  const mlH = (d.ml / maxBar) * 150;
                  const barW = 14;
                  return (
                    <g key={d.label} className="group cursor-pointer">
                      {/* Background hover track */}
                      <rect x={cx - barW * 1.5 - 4} y="20" width={barW * 3 + 8} height="150" rx="8" fill="#1e293b" opacity="0" className="group-hover:opacity-30 transition-opacity duration-300" />
                      {/* FF bar */}
                      <motion.rect 
                        initial={{ height: 0, y: 170 }}
                        whileInView={{ height: ffH, y: 170 - ffH }}
                        viewport={{ once: true, margin: '100px' }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        x={cx - barW - 3} width={barW} rx="6" fill="url(#barFF)" filter="url(#glowBarFF)" className="group-hover:brightness-125 transition-all duration-300" 
                      />
                      {/* FF value */}
                      <motion.text
                        initial={{ y: 170 }}
                        whileInView={{ y: 170 - ffH - 6 }}
                        viewport={{ once: true, margin: '100px' }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        x={cx - barW / 2 - 3} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold" className="opacity-0 group-active:opacity-100 transition-opacity duration-300 pointer-events-none drop-shadow-sm"
                      >{d.ff}</motion.text>

                      {/* ML bar */}
                      <motion.rect 
                        initial={{ height: 0, y: 170 }}
                        whileInView={{ height: mlH, y: 170 - mlH }}
                        viewport={{ once: true, margin: '100px' }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 + 0.1 }}
                        x={cx + 3} width={barW} rx="6" fill="url(#barML)" filter="url(#glowBarML)" className="group-hover:brightness-125 transition-all duration-300" 
                      />
                      {/* ML value */}
                      <motion.text
                        initial={{ y: 170 }}
                        whileInView={{ y: 170 - mlH - 6 }}
                        viewport={{ once: true, margin: '100px' }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 + 0.1 }}
                        x={cx + 3 + barW / 2} textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold" className="opacity-0 group-active:opacity-100 transition-opacity duration-300 pointer-events-none drop-shadow-sm"
                      >{d.ml}</motion.text>
                      {/* Label */}
                      <text x={cx} y="192" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="800" className="group-hover:fill-white transition-colors duration-300">{d.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Product Statistic — Ring Chart (right column) */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-b from-[#0f172a] to-[#050b14] rounded-[24px] p-6 sm:p-8 h-full flex flex-col gap-4 relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl" />
            <div className="flex justify-between items-center relative z-10">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Product Statistic</span>
                <p className="text-[10px] text-slate-600 mt-0.5">Track your product sales</p>
              </div>
            </div>
            {/* Nested Ring Chart */}
            <div className="flex items-center gap-5 mt-2">
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90 overflow-visible">
                  <defs>
                    <filter id="glowRing" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.6"/>
                    </filter>
                    <filter id="glowRingML" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#60a5fa" floodOpacity="0.6"/>
                    </filter>
                  </defs>
                  {/* BG track */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="12" />
                  {/* Ready */}
                  <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="12"
                    strokeDasharray={`${circ}`} strokeLinecap="round" filter="url(#glowRing)" 
                    initial={{ strokeDashoffset: circ }}
                    whileInView={{ strokeDashoffset: circ - readyDash }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Terjual */}
                  <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#60a5fa" strokeWidth="12"
                    strokeDasharray={`${circ}`} strokeLinecap="round" filter="url(#glowRingML)"
                    style={{ transform: `rotate(${readyFrac * 360}deg)`, transformOrigin: '60px 60px' }} 
                    initial={{ strokeDashoffset: circ }}
                    whileInView={{ strokeDashoffset: circ - terjualDash }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0 }}
                  />
                  {/* Inner ring (Cicilan - Cyan) */}
                  <circle cx="60" cy="60" r="34" fill="none" stroke="#050b14" strokeWidth="8" />
                  <motion.circle cx="60" cy="60" r="34" fill="none" stroke="#06b6d4" strokeWidth="8"
                    strokeDasharray={`${circ}`} strokeLinecap="round" 
                    initial={{ strokeDashoffset: circ }}
                    whileInView={{ strokeDashoffset: circ - (circ * 0.53 * cicilanFrac * 2) }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0 }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center w-[85px] h-[85px] rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] bg-slate-900/40 border border-slate-700/30">
                  <span className="text-2xl font-black text-white drop-shadow-md">{totalSemua}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <p className="text-3xl font-black text-white drop-shadow-sm">{totalTerjual.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Products Sales</p>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 w-max px-2 py-0.5 rounded-full border border-emerald-500/20 mt-1 shadow-sm">
                  <ArrowUpRight className="w-3 h-3" /> +{soldPercent}%
                </div>
              </div>
            </div>
            {/* Legend list */}
            <div className="space-y-3 border-t border-white/5 pt-4 flex-1 mt-1 relative z-10">
              {[
                { label: 'Free Fire', value: ffAccounts.length, badge: `+${Math.min(99, ffProfitMargin)}%`, color: 'bg-blue-500', shadow: 'shadow-blue-500/50', badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                { label: 'Mobile Legends', value: mlAccounts.length, badge: `+${Math.min(99, mlProfitMargin)}%`, color: 'bg-blue-400', shadow: 'shadow-blue-500/50', badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
                { label: 'Cicilan', value: totalCicilan, badge: `${totalCicilan}x`, color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50', badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs group cursor-default">
                  <span className="flex items-center gap-3 text-slate-300 font-medium group-hover:text-white transition-colors">
                    <span className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.5)] ${item.shadow}`} />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-white text-sm">{item.value}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold w-12 text-center shadow-sm ${item.badgeColor}`}>{item.badge}</span>
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
          <div className="bg-[#0f172a] neu-flat rounded-[24px] p-6 sm:p-8 h-full flex flex-col relative overflow-hidden">
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
            <div className="w-full flex-1 min-h-[192px] relative mt-4">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible group">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#2563eb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2563eb" floodOpacity="0.6"/>
                  </filter>
                </defs>
                {/* Horizontal Grid */}
                {[40, 80, 120].map(y => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="6 6" strokeOpacity="0.6" />
                ))}
                {/* Vertical Grid */}
                {[40, 130, 220, 310, 400, 490].map(x => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="140" stroke="#1e293b" strokeOpacity="0.3" strokeDasharray="4 4" />
                ))}
                <motion.path 
                  d="M 40 130 C 80 130, 90 110, 130 110 C 170 110, 180 90, 220 90 C 260 90, 270 50, 310 50 C 350 50, 360 40, 400 40 C 440 40, 450 60, 490 60 L 490 150 L 40 150 Z" 
                  fill="url(#areaGrad)" 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ duration: 1, delay: 0 }}
                />
                <motion.path 
                  d="M 40 130 C 80 130, 90 110, 130 110 C 170 110, 180 90, 220 90 C 260 90, 270 50, 310 50 C 350 50, 360 40, 400 40 C 440 40, 450 60, 490 60" 
                  fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" filter="url(#lineGlow)" 
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                {/* Glowing points - Point 1 (Maret) */}
                <motion.g 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ type: "spring", delay: 0 }}
                  className="hover:scale-110 transition-transform duration-300 origin-center cursor-pointer" style={{ transformOrigin: '220px 90px' }}
                >
                  <circle cx="220" cy="90" r="16" fill="#3b82f6" fillOpacity="0.2" className="animate-pulse" />
                  <circle cx="220" cy="90" r="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="3" />
                  {/* Elegant Tooltip */}
                  <g transform="translate(220, 75)">
                    <path d="M -28 -32 h 56 a 8 8 0 0 1 8 8 v 12 a 8 8 0 0 1 -8 8 h -21 l -7 7 l -7 -7 h -21 a 8 8 0 0 1 -8 -8 v -12 a 8 8 0 0 1 8 -8 z" fill="#1e293b" fillOpacity="0.95" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.5))" />
                    <text x="0" y="-12" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="800">{totalReady}</text>
                  </g>
                </motion.g>

                {/* Glowing points - Point 2 (Mei) */}
                <motion.g 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ type: "spring", delay: 1.1 }}
                  className="hover:scale-110 transition-transform duration-300 origin-center cursor-pointer" style={{ transformOrigin: '400px 40px' }}
                >
                  <circle cx="400" cy="40" r="16" fill="#3b82f6" fillOpacity="0.2" className="animate-pulse" />
                  <circle cx="400" cy="40" r="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="3" />
                  {/* Elegant Tooltip */}
                  <g transform="translate(400, 25)">
                    <path d="M -28 -32 h 56 a 8 8 0 0 1 8 8 v 12 a 8 8 0 0 1 -8 8 h -21 l -7 7 l -7 -7 h -21 a 8 8 0 0 1 -8 -8 v -12 a 8 8 0 0 1 8 -8 z" fill="#1e293b" fillOpacity="0.95" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.5))" />
                    <text x="0" y="-12" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="800">{totalTerjual}</text>
                  </g>
                </motion.g>

                {/* X axis */}
                {['Jan','Feb','Mar','Apr','Mei','Jun'].map((m, i) => (
                  <text key={m} x={40 + i * 90} y="158" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="800" className="group-hover:fill-slate-300 transition-colors duration-300">{m}</text>
                ))}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Customer Growth / Bubble Chart */}
        <motion.div variants={itemVariants}>
          <div className="bg-[#0f172a] neu-flat rounded-[24px] p-6 sm:p-8 h-full flex flex-col gap-4 relative overflow-hidden">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Customer Growth</span>
              <p className="text-[10px] text-slate-600 mt-0.5">Distribusi akun per kategori</p>
            </div>
            <div className="w-full flex-1 min-h-[160px] relative">
              <svg viewBox="0 0 240 110" className="w-full h-full overflow-visible">
                <defs>
                  {/* Outer glow filter */}
                  {bubbles.map(b => (
                    <filter key={`glow-${b.label}`} id={`glow-${b.label}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor={b.color} floodOpacity="0.5"/>
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4"/>
                    </filter>
                  ))}
                  {/* Glass Base gradient */}
                  {bubbles.map(b => (
                    <radialGradient key={`glass-${b.label}`} id={`glass-${b.label}`} cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                      <stop offset="30%" stopColor={b.color} stopOpacity="0.7" />
                      <stop offset="80%" stopColor={b.color} stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
                    </radialGradient>
                  ))}
                  {/* Inner glowing highlight */}
                  <radialGradient id="innerHighlight" cx="30%" cy="20%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="20%" stopColor="#ffffff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  {/* Bottom rim light */}
                  <radialGradient id="bottomRim" cx="50%" cy="95%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                    <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {bubbles.map((b, i) => (
                  <motion.g 
                    key={b.label} 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ type: "spring", damping: 12, delay: i * 0.15 }}
                    style={{ filter: `url(#glow-${b.label})`, transformOrigin: `${b.x}px ${b.y}px` }} 
                    className="hover:!scale-[1.15] transition-transform duration-300 origin-center cursor-pointer group"
                  >
                    <motion.g
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" }}
                    >
                      {/* Base colored glass sphere */}
                      <circle cx={b.x} cy={b.y} r={b.size / 2} fill={`url(#glass-${b.label})`} />
                      
                      {/* Inner border (Glass edge reflection) */}
                      <circle cx={b.x} cy={b.y} r={b.size / 2 - 1.5} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.3" className="group-hover:stroke-opacity-70 transition-opacity" />

                      {/* Top inner highlight */}
                      <circle cx={b.x} cy={b.y} r={b.size / 2} fill="url(#innerHighlight)" />

                      {/* Top curved specular crescent */}
                      <path d={`M ${b.x - b.size/2.5} ${b.y - b.size/6} A ${b.size/2} ${b.size/2} 0 0 1 ${b.x + b.size/2.5} ${b.y - b.size/6} A ${b.size/2.2} ${b.size/3} 0 0 0 ${b.x - b.size/2.5} ${b.y - b.size/6}`} fill="#ffffff" opacity="0.6" />

                      {/* Bottom rim light */}
                      <circle cx={b.x} cy={b.y} r={b.size / 2} fill="url(#bottomRim)" />
                      
                      {/* Texts */}
                      <text x={b.x} y={b.y - 2} textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900" style={{ textShadow: '0 3px 8px rgba(0,0,0,0.8)' }} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">{b.count}</text>
                      <text x={b.x} y={b.y + 12} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="900" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }} className="uppercase tracking-wider group-hover:text-white">{b.label}</text>
                    </motion.g>
                  </motion.g>
                ))}
              </svg>
            </div>
            {/* Ranked list */}
            <div className="space-y-3 border-t border-slate-800/60 pt-4 flex-1">
              {[
                { icon: <Gamepad2 className="w-4 h-4 text-blue-500" />, label: 'Free Fire', value: ffAccounts.length, pct: Math.round((ffAccounts.length / (totalSemua || 1)) * 100), color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/30', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]', iconBg: 'bg-slate-900 border-blue-900/50' },
                { icon: <Swords className="w-4 h-4 text-blue-300" />, label: 'Mobile Legends', value: mlAccounts.length, pct: Math.round((mlAccounts.length / (totalSemua || 1)) * 100), color: 'text-blue-300', bg: 'bg-blue-400/10 border-blue-400/30', glow: 'shadow-[0_0_10px_rgba(147,197,253,0.5)]', iconBg: 'bg-slate-900 border-blue-800/50' },
                { icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />, label: 'Ready Jual', value: totalReady, pct: Math.round((totalReady / (totalSemua || 1)) * 100), color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', glow: 'shadow-[0_0_10px_rgba(96,165,250,0.5)]', iconBg: 'bg-slate-900 border-blue-700/50' },
                { icon: <Wallet className="w-4 h-4 text-blue-600" />, label: 'Terjual', value: totalTerjual, pct: soldPercent, color: 'text-blue-600', bg: 'bg-blue-600/10 border-blue-600/30', glow: 'shadow-[0_0_10px_rgba(37,99,235,0.5)]', iconBg: 'bg-slate-900 border-blue-600/50' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs gap-2 group cursor-pointer hover:bg-slate-800/40 p-2.5 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-700/50 hover:shadow-lg">
                  <span className="flex items-center gap-3 text-slate-300 font-bold flex-shrink-0 group-hover:text-white transition-colors">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner border ${item.iconBg} ${item.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      {item.icon}
                    </span> 
                    {item.label}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-black text-white text-[15px] drop-shadow-md">{item.value.toLocaleString()}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${item.bg} ${item.color} w-12 text-center transition-all duration-300 group-hover:shadow-md`}>{item.pct}%</span>
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
          <div className="bg-[#0f172a] neu-flat rounded-[24px] p-6 sm:p-8 h-full space-y-5 relative overflow-hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Efisiensi Margin Akun</span>
            <div className="space-y-5 mt-2">
              {[
                { label: 'Free Fire', pct: ffProfitMargin, color: 'from-blue-600 to-blue-800', shadow: 'shadow-blue-700/50' },
                { label: 'Mobile Legends', pct: mlProfitMargin, color: 'from-blue-400 to-blue-300', shadow: 'shadow-blue-500/50' },
                { label: 'Rata-rata', pct: avgMargin, color: 'from-sky-500 to-cyan-400', shadow: 'shadow-sky-500/50' },
              ].map((bar, i) => (
                <div key={bar.label} className="space-y-2 group cursor-default">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{bar.label}</span>
                    <span className="text-white group-hover:scale-110 transition-transform origin-right">{bar.pct}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-800/80 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] p-0.5 border border-slate-700/50">
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      whileInView={{ width: `${bar.pct}%`, opacity: 1 }}
                      viewport={{ once: true, margin: '100px' }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0 + i * 0.2 }}
                      className={`bg-gradient-to-r ${bar.color} h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${bar.shadow} relative overflow-hidden`}
                    >
                      {/* Inner highlight for glass effect */}
                      <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/30 rounded-t-full" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Estimasi Keuntungan Bersih — wavy line */}
        <motion.div variants={itemVariants}>
          <div className="bg-[#0f172a] neu-flat rounded-[24px] p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden group">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-4">Estimasi Keuntungan Bersih</span>
            <div className="flex-1 w-full relative min-h-[128px]">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="smallChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glowLineSmall" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3b82f6" floodOpacity="0.7"/>
                  </filter>
                  <filter id="glowLineDash" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1d4ed8" floodOpacity="0.5"/>
                  </filter>
                </defs>
                {/* Horizontal Grid */}
                {[30, 60, 90].map(y => (
                  <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#1e293b" strokeDasharray="3 4" strokeOpacity="0.4" strokeWidth="1.5" />
                ))}
                
                {/* Area Gradient */}
                <motion.path 
                  d="M -10 60 C 20 60, 30 60, 50 60 C 100 60, 100 90, 150 90 C 200 90, 200 30, 250 30 C 280 30, 290 20, 310 20 L 310 120 L -10 120 Z" 
                  fill="url(#smallChartGrad)" 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ duration: 1, delay: 0 }}
                />

                {/* Animated Dash Line */}
                <motion.path 
                  d="M -10 60 C 20 60, 30 60, 50 60 C 100 60, 100 90, 150 90 C 200 90, 200 30, 250 30 C 280 30, 290 20, 310 20" 
                  fill="none" 
                  stroke="#1d4ed8" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  strokeLinecap="round"
                  filter="url(#glowLineDash)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
                />
                
                {/* Animated Main Solid Line (Outer Glow) */}
                <motion.path 
                  d="M -10 60 C 20 60, 30 60, 50 60 C 100 60, 100 90, 150 90 C 200 90, 200 30, 250 30 C 280 30, 290 20, 310 20" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  filter="url(#glowLineSmall)"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Animated Main Solid Line (Inner Core) */}
                <motion.path 
                  d="M -10 60 C 20 60, 30 60, 50 60 C 100 60, 100 90, 150 90 C 200 90, 200 30, 250 30 C 280 30, 290 20, 310 20" 
                  fill="none" 
                  stroke="#93c5fd" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '100px' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                {/* Glowing Dots */}
                {[
                  { cx: 50, cy: 60, delay: 0 },
                  { cx: 150, cy: 90, delay: 0 },
                  { cx: 250, cy: 30, delay: 1.1 }
                ].map((pt, i) => (
                  <motion.g 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '100px' }}
                    transition={{ type: "spring", delay: pt.delay }}
                    className="cursor-pointer group hover:scale-125 transition-transform origin-center hover:z-50"
                    style={{ transformOrigin: `${pt.cx}px ${pt.cy}px` }}
                  >
                    {/* Pulse Ring */}
                    <circle cx={pt.cx} cy={pt.cy} r="14" fill="#3b82f6" fillOpacity="0.15" className="animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Outer Dark Ring */}
                    <circle cx={pt.cx} cy={pt.cy} r="5.5" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" className="group-hover:stroke-[#3b82f6] transition-colors duration-300" />
                    
                    {/* Inner Bright Core */}
                    <circle cx={pt.cx} cy={pt.cy} r="2.5" fill="#60a5fa" />
                  </motion.g>
                ))}

                {/* X axis */}
                {['Jan','Mar','Jun'].map((m, i) => (
                  <text key={m} x={50 + i * 100} y="118" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="800" className="group-hover:fill-slate-300 uppercase tracking-wider transition-colors">{m}</text>
                ))}
              </svg>
            </div>
            <div className="pt-3 border-t border-slate-800/60 flex justify-between text-xs mt-2">
              <div>
                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Profit Bersih</p>
                <p className="text-white font-black text-sm mt-0.5 shadow-sm">Rp {netProfit.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Margin</p>
                <div className="flex justify-end mt-0.5">
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black rounded-full shadow-sm text-[10px]">
                    {avgMargin}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rata-rata & Performa */}
        <motion.div variants={itemVariants}>
          <div className="bg-[#0f172a] neu-flat rounded-[24px] p-6 sm:p-8 h-full flex flex-col gap-4 relative overflow-hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Ringkasan Performa</span>
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.04 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '100px' }}
              className="grid grid-cols-1 gap-3 flex-1"
            >
              {[
                { title: 'Total Keuntungan', desc: 'Profit kotor dari Terjual', val: `Rp ${totalRevenue.toLocaleString('id-ID')}`, icon: Wallet, color: 'from-cyan-400 to-blue-600' },
                { title: 'Akun Terjual', desc: `${totalSemua > 0 ? Math.round((totalTerjual / totalSemua) * 100) : 0}% konversi`, val: `${totalTerjual} unit`, icon: ShoppingCart, color: 'from-blue-500 to-indigo-700' },
                { title: 'Rata-rata Margin', desc: avgMargin > 60 ? 'Performa Baik' : 'Perlu Ditingkatkan', val: `${avgMargin}%`, icon: TrendingUp, color: 'from-sky-500 to-blue-800', warning: avgMargin <= 60 },
                { title: 'Performa Sistem', desc: 'Semua sistem berjalan', val: 'EXCELLENT', icon: CheckCircle2, color: 'from-slate-800 to-slate-950' }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-[20px] bg-gradient-to-br ${item.color} neu-flat border-t border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex justify-between items-center relative overflow-hidden group cursor-pointer transition-all duration-300`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-glass-shine mix-blend-overlay" />
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4 relative z-10 min-w-0 flex-1 pr-2">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] flex items-center justify-center bg-white/10 border border-white/20 shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 backdrop-blur-sm">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-[12px] sm:text-[13.5px] font-bold text-white tracking-wide truncate drop-shadow-sm">{item.title}</h5>
                      <p className="text-[9px] sm:text-[10px] text-white/80 mt-0.5 flex items-center gap-1.5 font-medium truncate drop-shadow-sm">
                        {item.warning && <AlertTriangle className="w-3.5 h-3.5 text-amber-300 drop-shadow-sm shrink-0" />}
                        <span className="truncate">{item.desc}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right relative z-10 pl-2 shrink-0">
                    {item.val === 'EXCELLENT' ? (
                      <div className="relative group/badge inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg blur opacity-50 group-hover/badge:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                        <div className="relative px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-400/50 backdrop-blur-md flex items-center gap-1.5 shadow-[inset_0_0_15px_rgba(251,191,36,0.25)]">
                           <Zap className="w-3 h-3 text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                           <span className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-widest drop-shadow-sm">EXCELLENT</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-[15px] font-extrabold tracking-tight text-white drop-shadow-md whitespace-nowrap">
                        {item.val}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
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

// trigger hmr
