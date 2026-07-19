import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
  isFastMode?: boolean;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, isFastMode = false }) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Phase 1: Loading
  useEffect(() => {
    if (phase === 1) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += isFastMode
          ? Math.floor(Math.random() * 10) + 8
          : Math.floor(Math.random() * 3) + 1;
        if (currentProgress >= 100) {
          setLoadingProgress(100);
          clearInterval(interval);
          setTimeout(() => setPhase(2), isFastMode ? 300 : 600);
        } else {
          setLoadingProgress(currentProgress);
        }
      }, isFastMode ? 50 : 150);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase 2 -> Phase 3
  useEffect(() => {
    if (phase === 2) {
      const timer = setTimeout(() => setPhase(3), isFastMode ? 800 : 2400);
      return () => clearTimeout(timer);
    }
  }, [phase, isFastMode]);

  const handleGetStarted = () => {
    setPhase(4);
    setTimeout(() => onComplete(), isFastMode ? 600 : 1200);
  };

  // (Auto-skip removed per user request so they can click it manually)

  return (
    <AnimatePresence>
      {phase !== 4 && (
        <motion.div
          key="cinematic-intro"
          exit={{ scale: 2.5, opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 1.2, ease: 'circIn' }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden antialiased bg-transparent"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Dark gradient overlay — exactly z-[1] per PRD */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.45) 50%, rgba(2,6,23,0.15) 100%)',
            }}
          />

          {/* === FOREGROUND — relative z-10 per PRD === */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 w-full max-w-5xl mx-auto">

            {/* ── PHASE 1: PREMIUM HORIZONTAL LOADER ── */}
            <AnimatePresence>
              {phase === 1 && (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-6 w-full max-w-xs"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="bg-black/80 backdrop-blur-2xl border border-blue-500/20 rounded-3xl p-8 w-full shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col items-center">

                    {/* Top inner glow line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/80 to-transparent" />
                    {/* Ambient glow inside box */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Percentage */}
                    <div className="flex items-baseline gap-1 mb-8 relative z-10">
                      <span
                        className="text-white font-black text-6xl tracking-tighter"
                        style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                      >
                        {loadingProgress}
                      </span>
                      <span className="text-blue-500 font-bold text-xl">%</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative z-10 shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-800 via-blue-500 to-cyan-300 rounded-full relative"
                        style={{ width: `${loadingProgress}%`, willChange: 'transform' }}
                        layout
                      >
                        {/* Glowing tip */}
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white opacity-60 blur-[2px]" />
                      </motion.div>
                    </div>

                    {/* Status Text */}
                    <motion.p
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-blue-300/80 text-[10px] tracking-[0.2em] uppercase font-bold mt-6 relative z-10"
                      style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                    >
                      {loadingProgress < 30
                        ? 'Menyiapkan Data...'
                        : loadingProgress < 60
                        ? 'Menyiapkan sesuatu yang ada di dalam aplikasi...'
                        : loadingProgress < 90
                        ? 'Sinkronisasi Cloud...'
                        : 'Membuka Portal...'}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── PHASE 2 & 3: TITLE BLOCK ── */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  key="title-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col items-center w-full"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* ── APP ICON + LIQUID GLASS CARD ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-8 flex flex-col items-center w-[85%] max-w-[320px] md:w-auto md:max-w-none"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {/* Animated Liquid Orbs behind the card */}
                    <motion.div
                      animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.2, 0.9, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500/30 rounded-full blur-[70px] pointer-events-none"
                      style={{ willChange: 'transform' }}
                    />
                    <motion.div
                      animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.8, 1.1, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-[70px] pointer-events-none"
                      style={{ willChange: 'transform' }}
                    />
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-3xl"
                      style={{ willChange: 'transform' }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-400/10 via-transparent to-blue-600/10 blur-[50px] mix-blend-overlay pointer-events-none" />
                    </motion.div>

                    {/* Premium Tech Glass Background Card */}
                    <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-gradient-to-b from-slate-900/80 to-[#0B1221]/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)]">
                      {/* Top Glare */}
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                      
                      {/* Bottom Glare */}
                      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

                      {/* Soft ambient inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-cyan-400/5" />

                      {/* Shimmer sweep */}
                      <motion.div
                        animate={{ left: ['-150%', '250%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', repeatDelay: 1 }}
                        className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -skew-x-[30deg] pointer-events-none"
                        style={{ willChange: 'transform' }}
                      />
                    </div>

                    {/* App Icon & Text Content */}
                    <div className="relative px-5 md:px-10 pt-6 md:pt-10 pb-5 md:pb-6 flex flex-col items-center w-full">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                        className="relative"
                        style={{ willChange: 'transform' }}
                      >
                        {/* Glow behind icon */}
                        <div className="absolute inset-0 rounded-[26px] blur-2xl bg-blue-500/50 scale-110" />
                        <img
                          src="/farid.png"
                          alt="FRD Logo"
                          className="relative w-20 h-20 md:w-32 md:h-32 rounded-[26px] shadow-2xl object-cover"
                          style={{ boxShadow: '0 8px 40px rgba(59,130,246,0.6), 0 0 0 1px rgba(255,255,255,0.2)' }}
                        />
                      </motion.div>

                      {/* Premium Tagline & Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-5 md:mt-7 relative z-10 flex flex-col items-center gap-3 md:gap-3.5 px-2 w-full"
                      >
                        <h2 
                          className="text-center font-black text-lg md:text-[22px] leading-snug bg-gradient-to-br from-white via-blue-50 to-slate-300 bg-clip-text text-transparent drop-shadow-sm max-w-[280px] md:max-w-[340px]"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          Platform Manajemen Akun Game Premium
                        </h2>

                        {/* Sub-tagline Badge */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-900/40 border border-blue-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        >
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,1)]"></span>
                          <span 
                            className="text-blue-200 text-[9px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Jual Beli Terpercaya #1
                          </span>
                        </motion.div>
                      </motion.div>

                      {/* ── CTA BUTTON ── */}
                      <AnimatePresence>
                        {phase === 3 && (
                          <motion.div
                            key="cta"
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-8 md:mt-10 w-full flex justify-center"
                            style={{ willChange: 'transform, opacity' }}
                          >
                            <motion.button
                              onClick={handleGetStarted}
                              className="w-auto group flex items-center justify-center gap-3 px-5 py-2 md:px-7 md:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50 hover:border-white/50 transition-all duration-300 relative overflow-hidden cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                              <span className="tracking-wide text-[12px] md:text-[14px] ml-1">Mulai Sekarang</span>
                              <div className="bg-white/20 rounded-full p-1.5 md:p-2 flex items-center justify-center backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5">
                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </div>
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
