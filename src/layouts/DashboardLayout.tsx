import React, { useEffect, useState, Suspense, useRef } from 'react';
import { createPortal } from 'react-dom';
import { lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Gamepad2, Search, CalendarPlus, 
  CalendarDays, BarChart3, History, BookmarkPlus, 
  LogOut, Cloud, Download, Upload, Bell, ChevronDown, 
  Menu, X, BookOpen, RefreshCw, Pencil, Plus, Check, ChevronUp, Clock, User, Smartphone, Monitor, Sun, Moon
} from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { syncToCloud } from '../lib/firebaseSync';
import { useAppStore, type AppView } from '../store/useAppStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useJurnalStore } from '../store/useJurnalStore';
import { useRequestStore } from '../store/useRequestStore';
import { toast } from 'sonner';
import { AlertCard } from '../components/ui/alert-card';
import LazyLoader from '../components/LazyLoader';
import SmoothScrollWrapper from '../components/SmoothScrollWrapper';
import ImportConfirmModal from '../components/ImportConfirmModal';
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Jurnal = lazy(() => import('../pages/Jurnal'));
const StokFF = lazy(() => import('../pages/StokFF'));
const StokML = lazy(() => import('../pages/StokML'));
const Statistik = lazy(() => import('../pages/Statistik'));
const Pencarian = lazy(() => import('../pages/Pencarian'));
const AkunMasuk = lazy(() => import('../pages/AkunMasuk'));
const KalenderKeuangan = lazy(() => import('../pages/KalenderKeuangan'));
const RiwayatPenjualan = lazy(() => import('../pages/RiwayatPenjualan'));

// Custom Select Component for beautiful dropdowns
const CustomSelect = ({ value, options, onChange }: { value: string, options: {value: string, label: string}[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center flex-1 xl:flex-none xl:w-28 font-display tracking-wide" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-950/50 border border-slate-700/50 text-slate-200 text-xs sm:text-sm rounded-[14px] sm:rounded-2xl pl-3 pr-2.5 py-1.5 sm:py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 font-medium hover:bg-slate-900 shadow-sm"
      >
        <span className="truncate">{options.find(o => o.value === value)?.label || value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 w-full bg-slate-900 border border-slate-700/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] rounded-xl sm:rounded-2xl overflow-hidden z-[100] max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors ${value === opt.value ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stok_ff', label: 'Stok FF', icon: Gamepad2 },
  { id: 'stok_ml', label: 'Stok ML', icon: Gamepad2 },
  { id: 'pencarian', label: 'Pesanan Request', icon: Search },
  { id: 'akun_masuk', label: 'Akun Masuk Harian', icon: CalendarPlus },
  { id: 'kalender_keuangan', label: 'Kalender Keuangan', icon: CalendarDays },
  { id: 'statistik', label: 'Statistik', icon: BarChart3 },
  { id: 'riwayat_penjualan', label: 'Riwayat Penjualan', icon: History },
  { id: 'wishlist', label: 'Wishlist Expansi', icon: BookmarkPlus },
  { id: 'jurnal', label: 'Jurnal Bisnis', icon: BookOpen },
];

const DashboardLayout: React.FC = () => {
  const { 
    currentView, setCurrentView, sidebarOpen, toggleSidebar,
    isSyncing, setSyncing, lastSynced, updateSyncTime,
    shopName, setShopName, shopSubtitle, setShopSubtitle,
    globalSearch, globalMonth, globalYear,
    setGlobalSearch, setGlobalMonth, setGlobalYear, resetGlobalFilters,
    isLoggedIn, userId, userName, userEmail, userPhoto, setGuestMode,
    savedAccounts, removeSavedAccount
  } = useAppStore();

  const [isEditingShopModal, setIsEditingShopModal] = useState(false);
  const [tempShopName, setTempShopName] = useState(shopName);
  const [tempShopSubtitle, setTempShopSubtitle] = useState(shopSubtitle);

  // UX Refinement: Clear globalSearch on route change
  useEffect(() => {
    setGlobalSearch('');
  }, [currentView, setGlobalSearch]);

  // Profile popup state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Notification popup state
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>((window as any).deferredPrompt || null);

  useEffect(() => {
    // Sync with global just in case it was caught before mount
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Scroll state for hiding bottom nav
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = React.useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 50) {
      setIsScrollingDown(true);
    } else if (currentScrollY < lastScrollY.current - 10) {
      setIsScrollingDown(false);
    }
    lastScrollY.current = currentScrollY;
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const data = {
      app: { shopName, shopSubtitle },
      inventory: useInventoryStore.getState().accounts,
      wishlist: useWishlistStore.getState().items,
      jurnal: useJurnalStore.getState().entries,
      requests: useRequestStore.getState().orders,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_akun_managemen_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.custom((t) => (
      <AlertCard
        isVisible={true}
        title="Export Berhasil"
        description="Data berhasil dieksport"
        onDismiss={() => toast.dismiss(t)}
      />
    ));
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Cek jika data menggunakan format lama ("accounts")
        if (data.accounts && Array.isArray(data.accounts)) {
          const mappedAccounts = data.accounts.map((oldAcc: any) => ({
            id: oldAcc.id || Math.random().toString(36).substr(2, 9),
            game: oldAcc.game === 'ff' ? 'Free Fire' : oldAcc.game === 'ml' ? 'Mobile Legends' : 'Free Fire',
            spec: oldAcc.spek || '-',
            rank: oldAcc.rank || '-',
            hargaBeli: oldAcc.buyPrice || 0,
            hargaJual: oldAcc.sellPrice || 0,
            targetJual: oldAcc.targetPrice || 0,
            status: oldAcc.status === 'terjual' ? 'Terjual' : oldAcc.status === 'cicilan' ? 'Cicilan' : 'Ready',
            email: oldAcc.email || '-',
            device: oldAcc.device || '-',
            bulanMasuk: oldAcc.buyDate ? new Date(oldAcc.buyDate).toLocaleString('id-ID', { month: 'long', year: 'numeric' }) : '-',
            tanggalMasuk: oldAcc.buyDate || '-',
            namaPenjual: oldAcc.seller || '-',
            pembeli: oldAcc.buyer || '-',
            password: oldAcc.password || '-',
            loginVia: '-',
            catatan: oldAcc.notes || oldAcc.keterangan || '-',
            tanggalJual: oldAcc.sellDate || oldAcc.tanggalJual || (oldAcc.status === 'terjual' ? oldAcc.buyDate : undefined)
          }));
          
          useInventoryStore.getState().setAllAccounts(mappedAccounts);
          toast.custom((t) => (
            <AlertCard
              isVisible={true}
              title="Import Berhasil"
              description={`Berhasil mengimpor ${mappedAccounts.length} akun dari backup versi lama!`}
              onDismiss={() => toast.dismiss(t)}
            />
          ));
          return;
        }

        // Cek jika data adalah array (kemungkinan backup mentah dari aplikasi lain)
        if (Array.isArray(data)) {
          useInventoryStore.getState().setAllAccounts(data);
          toast.custom((t) => (
            <AlertCard
              isVisible={true}
              title="Import Berhasil"
              description="Data akun berhasil diimpor dari format array!"
              onDismiss={() => toast.dismiss(t)}
            />
          ));
          return;
        }

        if (data.inventory) useInventoryStore.getState().setAllAccounts(data.inventory);
        if (data.wishlist) useWishlistStore.getState().setAllItems(data.wishlist);
        if (data.jurnal) useJurnalStore.getState().setAllEntries(data.jurnal);
        if (data.requests) useRequestStore.getState().setAllOrders(data.requests);
        if (data.app?.shopName) setShopName(data.app.shopName);
        if (data.app?.shopSubtitle) setShopSubtitle(data.app.shopSubtitle);

        toast.custom((t) => (
          <AlertCard
            isVisible={true}
            title="Import Berhasil"
            description="Data berhasil diimpor!"
            onDismiss={() => toast.dismiss(t)}
          />
        ));
      } catch (error) {
        toast.custom((t) => (
          <AlertCard
            isVisible={true}
            type="error"
            title="Import Gagal"
            description="Gagal mengimpor data. Pastikan file JSON valid."
            onDismiss={() => toast.dismiss(t)}
          />
        ));
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  const openEditModal = () => {
    setTempShopName(shopName);
    setTempShopSubtitle(shopSubtitle);
    setIsEditingShopModal(true);
  };

  const handleShopSave = () => {
    if (tempShopName.trim()) {
      setShopName(tempShopName.trim());
    }
    setShopSubtitle(tempShopSubtitle.trim());
    setIsEditingShopModal(false);
  };

  const handleCloudSync = async () => {
    if (!isLoggedIn || !userId) {
      toast.error('Gagal sinkronisasi: Anda harus login terlebih dahulu!');
      return;
    }
    
    setSyncing(true);
    const success = await syncToCloud(userId);
    
    if (success) {
      updateSyncTime();
      toast.success('Data berhasil disimpan ke server Cloud!');
    } else {
      toast.error('Gagal menyimpan data ke Cloud. Periksa koneksi Anda.');
    }
    setSyncing(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <LazyLoader><Dashboard /></LazyLoader>;
      case 'stok_ff': return <LazyLoader><StokFF /></LazyLoader>;
      case 'stok_ml': return <LazyLoader><StokML /></LazyLoader>;
      case 'statistik': return <LazyLoader><Statistik /></LazyLoader>;
      case 'pencarian': return <LazyLoader><Pencarian /></LazyLoader>;
      case 'akun_masuk': return <LazyLoader><AkunMasuk /></LazyLoader>;
      case 'kalender_keuangan': return <LazyLoader><KalenderKeuangan /></LazyLoader>;
      case 'riwayat_penjualan': return <LazyLoader><RiwayatPenjualan /></LazyLoader>;
      case 'wishlist': return <LazyLoader><Wishlist /></LazyLoader>;
      case 'jurnal': return <LazyLoader><Jurnal /></LazyLoader>;
      default: return (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm">
          <p className="text-slate-500 font-medium">Modul {currentView} sedang dalam pengembangan (Phase 2 Lanjutan).</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar - Clean White */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[60] w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between relative">
          
          <div>
            {/* Logo Shop Section */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 group/logo">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl shrink-0 relative overflow-hidden">
                  <img src="/farid.png" alt="Logo" className="w-full h-full object-cover" />
                  {/* Clean overlay */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none z-10"></div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover/logo:translate-x-full transition-transform duration-1000 ease-in-out z-20 pointer-events-none"></div>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-['Outfit'] font-black bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-900 bg-clip-text text-transparent text-xl leading-none tracking-tight whitespace-nowrap drop-shadow-sm">
                      {shopName}
                    </h1>
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-blue-500 shrink-0 drop-shadow-sm -translate-y-2 relative z-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                      <path d="M23,12l-2.44-2.78l0.34-3.68l-3.61-0.82l-1.89-3.18L12,3L8.6,1.54L6.71,4.72L3.1,5.54l0.34,3.68L1,12l2.44,2.78l-0.34,3.68l3.61,0.82l1.89,3.18L12,21l3.4,1.46l1.89-3.18l3.61-0.82l-0.34-3.68L23,12z M10.45,17L5.5,12.05l1.41-1.41l3.54,3.54l8.13-8.13l1.41,1.41L10.45,17z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5 -mt-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-sm">
                      PRO
                    </span>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold truncate">
                      {shopSubtitle}
                    </p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={openEditModal}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer opacity-0 group-hover/logo:opacity-100 ml-1 shrink-0"
                  title="Edit Profil Toko"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
              </div>
              <button className="lg:hidden text-slate-400 hover:text-slate-700" onClick={toggleSidebar}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Menu */}
            <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as AppView);
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className={`spotlight-effect overflow-hidden w-full flex items-center px-4 py-3 rounded-xl font-medium relative group transition-all duration-300 ease-out border ${
                      isActive 
                        ? 'text-white border-transparent z-10' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent hover:border-blue-200 hover:shadow-[0_6px_15px_rgba(59,130,246,0.12)] hover:-translate-y-[2px] hover:scale-[1.02] hover:z-10'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-sidebar-nav"
                        className="absolute inset-0 bg-[#1e40af] border-transparent rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 mr-3 relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span className={`relative z-10 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Footer & Popover (Google Account Swapper Mockup) */}
          <div className="p-4 border-t border-slate-100/50 bg-gradient-to-b from-transparent to-slate-50/80 shrink-0 relative">
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-[calc(100%+0.5rem)] left-4 right-4 bg-white/95 backdrop-blur-xl transform-gpu border border-white/40 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 text-left space-y-3"
                >
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block px-1">
                    STATUS AKUN
                  </span>
                  
                  {/* Status Card */}
                  <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl p-3 flex items-center justify-between border border-blue-100/50 shadow-sm mb-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl transform-gpu transform translate-x-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-3 relative z-10 w-full">
                      {isLoggedIn ? (
                        <div className="relative shrink-0">
                          <img src={userPhoto || `https://ui-avatars.com/api/?name=${userName}&background=bfdbfe&color=2563eb`} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 shrink-0 rounded-full border-2 flex items-center justify-center shadow-sm bg-slate-50 border-slate-200 text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800 truncate">{isLoggedIn ? userName : 'Belum Login'}</span>
                          {isLoggedIn && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider shrink-0">Aktif</span>}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5 truncate">{isLoggedIn ? userEmail : 'Hanya Tersimpan Lokal'}</span>
                      </div>
                    </div>
                  </div>

                  {isLoggedIn && (
                    <button 
                      onClick={async () => {
                        try {
                          await signOut(auth);
                          toast.success('Berhasil logout');
                          setIsProfileOpen(false);
                        } catch (error: any) {
                          toast.error('Gagal logout: ' + error.message);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl text-xs font-bold transition-all border border-slate-200 hover:border-red-200 cursor-pointer shadow-sm group"
                    >
                      <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      <span>Logout Akun Ini</span>
                    </button>
                  )}

                  {/* Multi-Account Switcher */}
                  {savedAccounts && savedAccounts.length > 0 && (
                    <>
                      <div className="h-px bg-slate-100 my-2" />
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block px-1 mb-2">
                        AKUN TERSIMPAN
                      </span>
                      <div className="max-h-[150px] overflow-y-auto space-y-1 mb-2 pr-1 custom-scrollbar">
                        {savedAccounts.filter(acc => acc.email !== userEmail).map((acc) => (
                          <div key={acc.email} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 group border border-transparent hover:border-slate-100 transition-all">
                            <div 
                              className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                              onClick={async () => {
                                try {
                                  // Switch account using login_hint
                                  const provider = googleProvider;
                                  provider.setCustomParameters({ login_hint: acc.email });
                                  await signInWithPopup(auth, provider);
                                  toast.success(`Beralih ke akun ${acc.displayName}`);
                                  setIsProfileOpen(false);
                                } catch (error: any) {
                                  toast.error('Gagal beralih akun: ' + error.message);
                                }
                              }}
                            >
                              <img src={acc.photoURL || `https://ui-avatars.com/api/?name=${acc.displayName}&background=f1f5f9&color=64748b`} alt="" className="w-7 h-7 rounded-full border border-slate-200 shadow-sm" />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">{acc.displayName}</span>
                                <span className="text-[9px] text-slate-500 truncate">{acc.email}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSavedAccount(acc.email);
                                toast.info('Akun dihapus dari daftar');
                              }}
                              className="w-6 h-6 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                              title="Hapus akun dari daftar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Auth Actions */}
                  <div className="h-px bg-slate-100 my-2" />
                  
                  <button 
                    onClick={async () => {
                      try {
                        const provider = googleProvider;
                        provider.setCustomParameters({ prompt: 'select_account' });
                        await signInWithPopup(auth, provider);
                        toast.success('Berhasil menambahkan akun baru!');
                        setIsProfileOpen(false);
                      } catch (error: any) {
                        toast.error('Gagal login: ' + error.message);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl text-xs font-bold transition-all border-2 border-dashed border-blue-200 hover:border-blue-400 cursor-pointer mb-2 group"
                  >
                    <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{isLoggedIn ? 'Tambah Akun Lain' : 'Login dengan Google'}</span>
                  </button>

                  {!isLoggedIn && (
                    <button 
                      onClick={() => {
                        setGuestMode(false);
                        toast.success('Keluar dari Mode Lokal');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Kembali ke Halaman Login</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Card Trigger */}
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-between p-3 -mx-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300 cursor-pointer select-none border border-transparent hover:border-slate-100 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-slate-300 transition-colors">
                  {isLoggedIn ? (
                    <img src={userPhoto || `https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isLoggedIn ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </div>
                
                <div className="text-left min-w-0">
                  <p className="text-[13px] font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{isLoggedIn ? userName : 'Akun Guest'}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    {isLoggedIn ? userEmail : 'Mode Lokal'}
                  </p>
                </div>
              </div>
              
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-blue-50 transition-colors">
                <ChevronUp className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${isProfileOpen ? '' : 'rotate-180'}`} />
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Dark Topbar */}
        <header className="py-3 sm:py-4 xl:py-0 xl:h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap xl:flex-nowrap items-center justify-between px-4 xl:px-6 z-50 sticky top-0 shadow-lg shadow-black/10 gap-x-4 gap-y-3 sm:gap-y-4 xl:gap-0">
          
          {/* 1. Menu & Search */}
          <div className="flex items-center gap-3 flex-1 xl:flex-none order-1">
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white shrink-0 p-1 sm:p-1.5">
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex relative group flex-1 xl:w-64">
              <Search className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari ID..." 
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-slate-950/50 border border-slate-700/50 rounded-[14px] sm:rounded-2xl text-xs sm:text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 w-full font-medium"
              />
            </div>
          </div>

          {/* 3. Filters (Order 3 on mobile, Order 2 on Desktop) */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto order-3 xl:order-2 xl:mx-4">
            <CustomSelect 
              value={globalMonth} 
              onChange={setGlobalMonth} 
              options={[
                {value: "Semua", label: "Semua Bulan"},
                {value: "Jan", label: "Januari"},
                {value: "Feb", label: "Februari"},
                {value: "Mar", label: "Maret"},
                {value: "Apr", label: "April"},
                {value: "Mei", label: "Mei"},
                {value: "Jun", label: "Juni"},
                {value: "Jul", label: "Juli"},
                {value: "Agu", label: "Agustus"},
                {value: "Sep", label: "September"},
                {value: "Okt", label: "Oktober"},
                {value: "Nov", label: "November"},
                {value: "Des", label: "Desember"}
              ]} 
            />
            
            <CustomSelect 
              value={globalYear} 
              onChange={setGlobalYear} 
              options={[
                {value: "Semua", label: "Semua Tahun"},
                {value: "2025", label: "2025"},
                {value: "2026", label: "2026"},
                {value: "2027", label: "2027"},
                {value: "2028", label: "2028"},
                {value: "2029", label: "2029"},
                {value: "2030", label: "2030"}
              ]} 
            />
            
            <button 
              onClick={resetGlobalFilters}
              className="p-1.5 sm:p-2 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer rounded-[14px] sm:rounded-2xl bg-slate-950/50 border border-slate-700/50 group flex-none"
              title="Reset Filter"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>
          
          {/* 2. Right Side / Bell (Order 2 on mobile, Order 3 on Desktop) */}
          <div className="flex items-center justify-end gap-3 shrink-0 order-2 xl:order-3">
            {/* Cloud Actions (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-3 border-r border-slate-800/80 pr-6">
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  Tersimpan ke Cloud
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Tersimpan: {lastSynced}
                </span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.90 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={handleCloudSync}
                disabled={isSyncing}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] text-white rounded-xl transition-colors shadow-md shadow-blue-900/20 disabled:opacity-70 cursor-pointer"
                title="Simpan ke Cloud"
              >
                <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              </motion.button>
              <div className="flex gap-1.5">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.90 }}
                  onClick={handleExportData}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-blue-500/30 hover:bg-blue-500/5 bg-slate-950/50 rounded-xl transition-colors cursor-pointer" title="Export">
                  <Download className="w-4 h-4" />
                </motion.button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportData} 
                  accept=".json" 
                  className="hidden" 
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.90 }}
                  onClick={() => setIsImportModalOpen(true)}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-blue-500/30 hover:bg-blue-500/5 bg-slate-950/50 rounded-xl transition-colors cursor-pointer" title="Import">
                  <Upload className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.90 }}
              onClick={() => {
                if (isDarkMode) {
                  toast.info('Tema Terang (Light Mode) sedang dalam tahap pengembangan dan akan segera hadir!', { icon: '☀️' });
                } else {
                  setIsDarkMode(true);
                }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative p-1.5 sm:p-2 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer rounded-[14px] sm:rounded-2xl bg-slate-950/50 border border-slate-700/50 group"
              title="Ganti Tema"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Download App Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.90 }}
              onClick={() => setIsInstallModalOpen(true)}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative p-1.5 sm:p-2 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer rounded-[14px] sm:rounded-2xl bg-slate-950/50 border border-slate-700/50 group"
              title="Download Aplikasi"
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-indigo-300" />
            </motion.button>

            {/* Notification */}
            <div className="flex items-center gap-4 relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.90 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1.5 sm:p-2 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer rounded-[14px] sm:rounded-2xl bg-slate-950/50 border border-slate-700/50"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-0 right-0 sm:top-0.5 sm:right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full border-[1.5px] border-slate-900"></span>
              </motion.button>
              
              {createPortal(
                <AnimatePresence>
                  {isNotifOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsNotifOpen(false)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-[88%] sm:w-[92%] max-w-[280px] sm:max-w-md transform-gpu bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-[18px] sm:rounded-[24px] p-3.5 sm:p-5 neu-flat text-left space-y-3.5 sm:space-y-5"
                      >
                      {/* Add a subtle glow inside the panel */}
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                      
                      <div className="flex items-center justify-between border-b border-slate-800/50 pb-2.5 sm:pb-3 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xs sm:text-sm font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                            Notifikasi
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-blue-300 font-extrabold bg-blue-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                            1 Baru
                          </span>
                        </div>
                        <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-all cursor-pointer">
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-2.5 sm:space-y-3 max-h-[60vh] sm:max-h-72 overflow-y-auto scrollbar-hide p-1.5 sm:p-3 -mx-1.5 sm:-mx-3 relative z-10">
                        {/* Notification Item */}
                        <div className="flex gap-2.5 sm:gap-4 items-start p-2.5 sm:p-4 bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-xl rounded-[14px] sm:rounded-2xl relative group transition-all duration-300 cursor-pointer shadow-[0_8px_20px_rgba(37,99,235,0.3),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2)] border border-blue-300/30 hover:scale-[1.03] hover:-translate-y-1 z-20">
                          <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                          <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg sm:rounded-xl shrink-0 mt-0.5 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.5),0_4px_10px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-white/10">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="pr-3 sm:pr-4">
                            <p className="font-display text-[13px] sm:text-base font-black text-white leading-tight">Akun ML Baru Ditambahkan</p>
                            <p className="text-[10px] sm:text-[11px] text-blue-50 mt-1 sm:mt-1.5 leading-relaxed font-medium">
                              Sistem mencatat stok baru: Mobile Legends Lvl 30, Mythic.
                            </p>
                            <span className="text-[9px] sm:text-[10px] text-blue-200 font-bold mt-2 sm:mt-2.5 flex items-center gap-1.5 opacity-90">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Baru saja
                            </span>
                          </div>
                        </div>

                        {/* Old Notification Item */}
                        <div className="flex gap-2.5 sm:gap-4 items-start p-2.5 sm:p-4 bg-gradient-to-br from-blue-900/40 to-[#0f172a] backdrop-blur-sm rounded-[14px] sm:rounded-2xl border border-blue-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-gradient-to-br hover:from-blue-800/50 hover:to-[#1e293b] transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 z-10 relative">
                          <div className="p-2 sm:p-2.5 bg-blue-500/10 rounded-lg sm:rounded-xl shrink-0 mt-0.5 group-hover:bg-blue-500/20 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.5)]">
                            <Cloud className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-[13px] sm:text-sm font-bold text-blue-100 group-hover:text-white transition-colors">Sinkronisasi Berhasil</p>
                            <p className="text-[10px] sm:text-[11px] text-blue-200/70 mt-1 leading-relaxed">
                              Semua data telah disinkronkan ke server cloud dengan aman.
                            </p>
                            <span className="text-[9px] sm:text-[10px] text-blue-300/80 font-bold mt-2 sm:mt-2.5 flex items-center gap-1.5">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 1 jam yang lalu
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full relative z-10 overflow-hidden group rounded-[12px] sm:rounded-lg p-2.5 sm:p-2.5 text-center text-[11px] sm:text-xs font-bold text-blue-400 transition-all duration-300 bg-blue-900/20 hover:bg-blue-600/30 border border-blue-500/20 hover:border-blue-500/50">
                        <span className="relative z-10 group-hover:text-white transition-colors">Tandai semua dibaca</span>
                        <div className="absolute inset-0 w-0 bg-blue-500/20 group-hover:w-full transition-all duration-500 ease-out"></div>
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>,
              document.body
            )}
            </div>
          </div>
        </header>
 
        {/* Dynamic Page Content */}
        <main className="flex-1 relative overflow-hidden bg-slate-950">
          <SmoothScrollWrapper onScroll={handleScroll}>
            <div className="p-4 lg:p-8 pb-32 lg:pb-12">
              <div className="max-w-[1600px] mx-auto w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  >
                    {renderView()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </SmoothScrollWrapper>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Modal Edit Toko */}
      <AnimatePresence>
        {isEditingShopModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingShopModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-[24px] p-5 sm:p-6 max-w-[320px] sm:max-w-md w-[90%] sm:w-full shadow-2xl relative z-10 text-left overflow-hidden"
            >
              {/* Subtle top glare */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              <h3 className="text-base sm:text-lg font-display font-bold text-white mb-4">Edit Profil Toko</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans">Nama Toko</label>
                  <input
                    type="text"
                    value={tempShopName}
                    onChange={(e) => setTempShopName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-[14px] px-4 py-2.5 sm:py-3 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 font-sans font-medium"
                    placeholder="Nama Toko"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans">Deskripsi</label>
                  <input
                    type="text"
                    value={tempShopSubtitle}
                    onChange={(e) => setTempShopSubtitle(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-[14px] px-4 py-2.5 sm:py-3 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 font-sans font-medium"
                    placeholder="Deskripsi"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsEditingShopModal(false)}
                  className="px-4 py-2.5 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-[12px] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleShopSave}
                  className="px-5 py-2.5 text-[12px] sm:text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 rounded-[14px] shadow-[0_8px_20px_rgba(59,130,246,0.25),inset_0_2px_5px_rgba(255,255,255,0.2)] border border-blue-400/30 cursor-pointer"
                >
                  Simpan Perubahan
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImportConfirmModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={() => fileInputRef.current?.click()}
      />

      {/* Install App Modal */}
      {createPortal(
        <AnimatePresence>
          {isInstallModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInstallModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl text-white p-6 rounded-[28px] max-w-[300px] sm:max-w-[320px] w-[88%] overflow-hidden text-center"
            >
              {/* Subtle background accent (no bright glow) */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
              {/* Graphic/Icon */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 rounded-[20px] bg-white/5 border border-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center backdrop-blur-md"
              >
                <motion.div
                  animate={{ rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Monitor className="w-7 h-7 sm:w-9 sm:h-9 text-blue-400 relative -left-2 sm:-left-3" strokeWidth={1.5} />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute right-2.5 sm:right-3.5 bottom-2.5 sm:bottom-3.5 bg-slate-800 rounded-lg p-1.5 border border-white/10 shadow-lg"
                >
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" strokeWidth={2} />
                </motion.div>
              </motion.div>

              <h3 className="font-display text-base sm:text-lg font-black text-white mb-1.5 sm:mb-2 leading-tight tracking-tight">Instal Aplikasi ke Layar Anda?</h3>
              <p className="text-slate-400 text-[11px] sm:text-xs mb-5 sm:mb-6 leading-relaxed font-sans">
                Dapatkan akses lebih cepat dengan memasang <strong>{shopName}</strong> di perangkat Anda.
              </p>

              <div className="flex flex-col gap-2.5 sm:gap-3">
                <button 
                  onClick={async () => {
                    setIsInstallModalOpen(false);
                    if (deferredPrompt) {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') {
                        toast.success('Aplikasi berhasil diinstal!');
                      } else {
                        toast.error('Instalasi dibatalkan.');
                      }
                      setDeferredPrompt(null);
                    } else {
                      toast.info('Instalasi otomatis tidak tersedia. Gunakan menu Install App di browser Anda.');
                    }
                  }}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg border border-blue-400/50 text-white rounded-[14px] sm:rounded-[20px] text-[13px] sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  Instal Sekarang
                </button>
                <button 
                  onClick={() => setIsInstallModalOpen(false)}
                  className="w-full py-2 sm:py-2.5 text-slate-400 hover:text-white text-[11px] sm:text-xs font-semibold transition-colors rounded-xl hover:bg-white/5 cursor-pointer"
                >
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      {/* Mobile Bottom Navigation (Liquid Glass with Blue Puffy Active State) */}
      <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[360px] z-40 pb-safe transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${(sidebarOpen || isScrollingDown) ? 'translate-y-40 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] rounded-[2.5rem] px-2 py-2 flex items-center justify-between relative overflow-hidden ring-1 ring-white/5">
          {/* Glossy top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-80" />
          {/* Liquid blue ambient glow inside the glass */}
          <div className="absolute inset-x-0 -bottom-10 h-24 bg-blue-500/20 blur-3xl pointer-events-none" />
          
          {['stok_ff', 'stok_ml', 'dashboard', 'statistik', 'riwayat_penjualan'].map(id => {
            const item = navItems.find(i => i.id === id);
            if (!item) return null;
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentView(item.id as AppView)}
                className="flex flex-col items-center justify-center gap-0.5 relative py-2 px-1 flex-1 min-w-0 group"
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-bottom-nav"
                    className="absolute inset-0 bg-blue-600 border border-blue-500 shadow-[0_8px_20px_rgba(37,99,235,0.4),inset_0_2px_10px_rgba(255,255,255,0.3),inset_0_-4px_10px_rgba(0,0,0,0.15)] rounded-[1.25rem] overflow-hidden"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                     {/* Glossy reflection on top to make it puffy */}
                     <div className="absolute inset-x-2 top-0 h-4 bg-gradient-to-b from-white/50 to-transparent rounded-full opacity-90 pointer-events-none" />
                     {/* Glossy reflection on bottom to enhance 3D effect */}
                     <div className="absolute inset-x-4 bottom-0 h-2 bg-gradient-to-t from-white/20 to-transparent rounded-full opacity-60 pointer-events-none" />
                  </motion.div>
                )}
                <item.icon className={`w-5 h-5 relative z-10 transition-all duration-400 ease-out ${isActive ? 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'text-slate-400/80 group-hover:text-white group-hover:-translate-y-0.5'}`} />
                <span className={`text-[9px] relative z-10 font-black transition-all duration-400 ease-out tracking-wider truncate w-full text-center ${isActive ? 'text-white opacity-100 drop-shadow-md' : 'text-slate-500/70 opacity-0 translate-y-2'}`}>
                  {item.id === 'dashboard' ? 'HOME' : item.id === 'stok_ff' ? 'STOK FF' : item.id === 'stok_ml' ? 'STOK ML' : item.id === 'statistik' ? 'ANALITIK' : 'RIWAYAT'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
