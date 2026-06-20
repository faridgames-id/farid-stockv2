import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Zap, Lock } from 'lucide-react';

interface LuxeIntroProps {
  onComplete: () => void;
}

const LuxeIntro: React.FC<LuxeIntroProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 800); // Wait for exit animation
  };

  // Generate floating "asteroids" / glass shapes
  const floaters = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 2,
    rotate: Math.random() * 360,
  }));

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="landing-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-sans"
        >
          {/* Giant Planet Horizon Effect */}
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[150vw] h-[100vw] sm:w-[120vw] sm:h-[80vw] md:w-[100vw] md:h-[60vw] rounded-[100%] bg-[#020617] border-[1px] border-blue-500/30 shadow-[0_0_150px_rgba(59,130,246,0.3)_inset,0_0_100px_rgba(59,130,246,0.2)] pointer-events-none z-0">
            {/* Planet surface glow */}
            <div className="absolute inset-0 rounded-[100%] shadow-[0_0_80px_rgba(255,255,255,0.1)_inset] bg-gradient-to-b from-blue-600/10 to-transparent" />
          </div>

          {/* Core Core Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/20 blur-[120px] pointer-events-none z-0" />

          {/* Floating Glass Debris */}
          {floaters.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: `${f.y}vh`, x: `${f.x}vw`, rotate: f.rotate }}
              animate={{ 
                opacity: [0, 0.4, 0.4, 0], 
                y: [`${f.y}vh`, `${f.y - 20}vh`],
                rotate: f.rotate + 180
              }}
              transition={{
                duration: f.duration,
                repeat: Infinity,
                delay: f.delay,
                ease: 'linear'
              }}
              className="absolute bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl pointer-events-none z-0"
              style={{ width: f.size, height: f.size, boxShadow: '0 8px 32px rgba(59,130,246,0.1)' }}
            />
          ))}

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full mt-20">
            
            {/* Top info pill */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-4 text-xs md:text-sm font-semibold tracking-widest uppercase text-blue-300 mb-8 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Presisi</span>
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Kecepatan</span>
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Keamanan</span>
            </motion.div>

            {/* Title / Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className="flex flex-col items-center justify-center mb-6"
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 tracking-tight leading-none drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] uppercase">
                FRD ACCOUNT
              </h1>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white/90 tracking-widest uppercase mt-2 drop-shadow-lg">
                Management
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-2xl text-blue-200/80 font-light tracking-wide mb-12 max-w-2xl"
            >
              Berhenti Menebak - Mulai Bertumbuh.<br/>
              <span className="text-sm md:text-base text-slate-400 mt-2 block">
                Bangun infrastruktur perkembangan bisnis digital Anda menggunakan sistem manajemen akun cerdas dengan analitik pasar AI.
              </span>
            </motion.p>

            {/* Get Started Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, delay: 1 }}
              onClick={handleStart}
              className="group relative flex items-center gap-4 pl-8 pr-2 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full cursor-pointer overflow-hidden border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              
              <span className="text-white font-bold tracking-wide uppercase text-sm">
                Get Started
              </span>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 transition-transform group-hover:rotate-[-45deg]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          </div>

          {/* Bottom decorative fading flames / nebula */}
          <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-blue-900/20 via-blue-900/5 to-transparent pointer-events-none blur-2xl z-0" />
          <div className="absolute -bottom-[20vh] left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-blue-500/20 rounded-[100%] blur-[80px] pointer-events-none z-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LuxeIntro;
