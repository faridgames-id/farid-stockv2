import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ChevronRight, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setGuestMode } = useAppStore();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Berhasil login dengan Google!');
    } catch (error: any) {
      toast.error('Gagal login: ' + error.message);
    }
  };

  const handleDummyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Silakan isi username dan password');
      return;
    }
    // Dummy login just sets guest mode for now since it's "pajangan"
    toast.success(`Selamat datang, ${username}! (Mode Lokal Aktif)`);
    setGuestMode(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-['Inter']">
      
      {/* Background Decorative Gradients (Blue Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        {/* Premium Tech Glass Background Card */}
        <div className="relative bg-gradient-to-b from-slate-900/80 to-[#0B1221]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden">
          
          {/* Top Glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none" />
          {/* Bottom Glare */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" />
          {/* Soft ambient inner glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-cyan-400/5 pointer-events-none" />
          
          {/* Avatar Header */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <User className="w-10 h-10 text-blue-400/80" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 to-transparent opacity-50" />
            </div>
          </div>

          <form onSubmit={handleDummyLogin} className="space-y-4 relative z-10">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium shadow-inner"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium shadow-inner"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-[13px] mt-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded bg-slate-950/50 border border-slate-700 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                  <div className="w-2 h-2 rounded-sm bg-blue-400 hidden group-hover:block" />
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors italic">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full relative group overflow-hidden py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold tracking-wide border border-blue-400/30 hover:border-white/40 transition-all shadow-md cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <span className="relative z-10">Masuk</span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="px-3 text-[11px] text-slate-500 uppercase tracking-widest font-bold">Atau</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          {/* Google Login (Main) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleGoogleLogin}
            type="button"
            className="w-full relative group overflow-hidden flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-500 shadow-md cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)] border border-white/10 group-hover:scale-110 transition-all relative z-10">
              <span className="text-white font-black text-[13px] drop-shadow-sm">G</span>
            </div>
            <span className="relative z-10">Login dengan Google</span>
          </motion.button>

          {/* Guest Login */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                toast.info('Masuk sebagai Guest (Mode Lokal)');
                setGuestMode(true);
              }}
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto group"
            >
              <span>Masuk sebagai Guest (Offline)</span>
              <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
