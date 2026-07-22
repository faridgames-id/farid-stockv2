import React, { useState, useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import CinematicIntro from './components/CinematicIntro';
import LoginPage from './pages/LoginPage';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { fetchFromCloud, syncToCloud } from './lib/firebaseSync';
import { useAppStore } from './store/useAppStore';
import { useInventoryStore } from './store/useInventoryStore';
import { useWishlistStore } from './store/useWishlistStore';
import { useJurnalStore } from './store/useJurnalStore';
import { useRequestStore } from './store/useRequestStore';

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const { setUser, clearUser, isLoggedIn, guestMode, addSavedAccount, userId } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName || 'Pengguna',
          email: user.email || '',
          photoURL: user.photoURL || ''
        });
        
        // Auto-save account to local storage for multi-account switcher
        addSavedAccount({
          uid: user.uid,
          displayName: user.displayName || 'Pengguna',
          email: user.email || '',
          photoURL: user.photoURL || ''
        });

        // Fetch data from cloud automatically upon login
        try {
          const hasData = await fetchFromCloud(user.uid);
          if (hasData) {
            toast.success("Data berhasil dipulihkan dari Cloud!");
          }
        } catch (error) {
          toast.error("Gagal memulihkan data dari Cloud, periksa koneksi internet.");
        }
      } else {
        clearUser();
        
        // Securely wipe local data so next user doesn't see it
        useInventoryStore.getState().setAllAccounts([]);
        useWishlistStore.getState().setAllItems([]);
        useJurnalStore.getState().setAllEntries([]);
        useRequestStore.getState().setAllOrders([]);
        
        // Optional: Remove local storage keys entirely for user data
        localStorage.removeItem('inventory-storage');
        localStorage.removeItem('wishlist-storage');
        localStorage.removeItem('jurnal-storage');
        localStorage.removeItem('request-storage');
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser, addSavedAccount]);

  // Auto-Sync Effect
  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    let syncTimeout: NodeJS.Timeout;
    
    const triggerSync = () => {
      // Mencegah auto-sync jika data kosong semua untuk menghindari terhapusnya data di Cloud 
      // saat login di device baru (dimana localStorage masih kosong)
      const accounts = useInventoryStore.getState().accounts;
      const wishlist = useWishlistStore.getState().items;
      const jurnal = useJurnalStore.getState().entries;
      const requests = useRequestStore.getState().orders;
      
      if (accounts.length === 0 && wishlist.length === 0 && jurnal.length === 0 && requests.length === 0) {
        return;
      }

      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        syncToCloud(userId);
      }, 2000); // 2 seconds debounce
    };

    const unsubInventory = useInventoryStore.subscribe(triggerSync);
    const unsubWishlist = useWishlistStore.subscribe(triggerSync);
    const unsubJurnal = useJurnalStore.subscribe(triggerSync);
    const unsubRequest = useRequestStore.subscribe(triggerSync);

    return () => {
      clearTimeout(syncTimeout);
      unsubInventory();
      unsubWishlist();
      unsubJurnal();
      unsubRequest();
    };
  }, [isLoggedIn, userId]);

  // Zero-React-Render spotlight: Direct DOM mutation + rAF throttle
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return; // throttle to one rAF per frame
      rafId = requestAnimationFrame(() => {
        // querySelectorAll only runs inside rAF — off the critical path
        const cards = document.querySelectorAll<HTMLElement>('.spotlight-effect');
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* Persisten Animated Background untuk Intro dan Login Page */}
      {(!isLoggedIn && !guestMode) && (
        <div className="fixed inset-0 z-0 bg-slate-950 overflow-hidden">
          {/* Animated Gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* CSS Stars Background (menggunakan pattern radial kecil) */}
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))', backgroundRepeat: 'repeat', backgroundSize: '200px 200px' }} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!introComplete && (
          <CinematicIntro key="intro" isFastMode={isLoggedIn || guestMode} onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>
      {introComplete && !isLoggedIn && !guestMode && <LoginPage />}
      {introComplete && (isLoggedIn || guestMode) && <DashboardLayout />}
      <Toaster 
        position="top-center" 
        duration={2000}
        toastOptions={{
          classNames: {
            toast: "group !backdrop-blur-xl !border !shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.3)] !rounded-xl sm:!rounded-2xl !text-white font-display !px-4 sm:!px-6 !py-2.5 sm:!py-4 !items-center !gap-2 sm:!gap-4 transition-all hover:scale-105",
            success: "!bg-gradient-to-r !from-emerald-600 !to-emerald-800 !border-emerald-500/50",
            error: "!bg-gradient-to-r !from-rose-600 !to-rose-800 !border-rose-500/50",
            info: "!bg-gradient-to-r !from-blue-600 !to-indigo-800 !border-blue-500/50",
            warning: "!bg-gradient-to-r !from-amber-600 !to-orange-800 !border-amber-500/50",
            title: "!text-white !font-black !text-xs sm:!text-[15px] !tracking-wide",
            description: "!text-blue-50 !text-[10px] sm:!text-xs !mt-0.5 sm:!mt-1 !font-medium",
            icon: "!w-5 sm:!w-6 !h-5 sm:!h-6 !drop-shadow-lg",
          }
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
