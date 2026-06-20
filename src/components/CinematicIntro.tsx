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
                    className="relative mb-8 flex flex-col items-center"
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

                    {/* Liquid Glass Background Card */}
                    <div
                      className="absolute inset-0 rounded-[32px] overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(59,130,246,0.02) 100%)',
                        borderTop: '1px solid rgba(255,255,255,0.3)',
                        borderLeft: '1px solid rgba(255,255,255,0.15)',
                        borderRight: '1px solid rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        backdropFilter: 'blur(35px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(35px) saturate(140%)',
                        boxShadow:
                          '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.1), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.4)',
                      }}
                    >
                      {/* Organic Liquid Reflection */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-overlay">
                        <filter id="liquidNoise">
                          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={3} result="noise" />
                          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#liquidNoise)" />
                      </svg>

                      {/* Shimmer line */}
                      <motion.div
                        animate={{ left: ['-150%', '250%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', repeatDelay: 1 }}
                        className="absolute top-0 bottom-0 w-[80%] bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[30deg] pointer-events-none blur-[2px]"
                        style={{ willChange: 'transform' }}
                      />
                    </div>

                    {/* App Icon & Text Content */}
                    <div className="relative px-8 md:px-10 pt-8 md:pt-10 pb-5 md:pb-6 flex flex-col items-center">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                        className="relative"
                        style={{ willChange: 'transform' }}
                      >
                        {/* Glow behind icon */}
                        <div className="absolute inset-0 rounded-[26px] blur-2xl bg-blue-500/50 scale-110" />
                        <img
                          src="/logo.jpg"
                          alt="FRD Logo"
                          className="relative w-20 h-20 md:w-32 md:h-32 rounded-[26px] shadow-2xl object-cover"
                          style={{ boxShadow: '0 8px 40px rgba(59,130,246,0.6), 0 0 0 1px rgba(255,255,255,0.2)' }}
                        />
                      </motion.div>

                      {/* Tagline — mobile-safe padding per PRD */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-slate-200 text-sm md:text-base text-center font-medium mt-6 md:mt-8 tracking-wide relative z-10 px-4 md:px-0 max-w-xs md:max-w-none"
                        style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                      >
                        Platform Manajemen Akun Game Premium
                      </motion.p>

                      {/* Sub-tagline */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-blue-400 text-[10px] md:text-xs font-bold mt-2 tracking-widest uppercase text-center drop-shadow-lg relative z-10 px-4 md:px-0"
                        style={{ fontFamily: "'Outfit', 'Inter', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        PUSAT JUAL BELI AKUN TERPERCAYA #1
                      </motion.p>

                      {/* ── CTA BUTTON ── */}
                      <AnimatePresence>
                        {phase === 3 && (
                          <motion.div
                            key="cta"
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 md:mt-8 w-full flex justify-center"
                            style={{ willChange: 'transform, opacity' }}
                          >
                            {/* Touch-friendly: w-full on mobile, w-auto on desktop per PRD */}
                            <motion.button
                              onClick={handleGetStarted}
                              className="w-full max-w-[280px] md:max-w-none md:w-auto flex items-center justify-center gap-4 px-6 py-3 md:px-8 md:py-3.5 bg-[#0f172a] text-white rounded-full font-semibold border border-slate-700 hover:border-cyan-500 hover:bg-[#1e293b] transition-all duration-300 shadow-xl relative z-10 cursor-pointer"
                              style={{ fontFamily: "'Outfit', 'Inter', sans-serif", willChange: 'transform' }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Get Started</span>
                              <div className="bg-blue-600 rounded-full p-2 flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.6)]">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
