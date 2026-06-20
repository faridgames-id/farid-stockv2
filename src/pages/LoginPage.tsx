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
        {/* Glassmorphism Card (Liquid Bright) */}
        <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden">
          
          {/* Diagonal Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.15] to-white/0 transform -skew-x-12 -translate-x-full animate-[glass-shine_6s_infinite]" />
          
          {/* Avatar Header */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner relative overflow-hidden">
              <User className="w-10 h-10 text-white/60" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
            </div>
          </div>

          <form onSubmit={handleDummyLogin} className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all font-medium shadow-inner"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all font-medium shadow-inner"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm mt-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded bg-white/10 border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors">
                  <div className="w-2 h-2 rounded-sm bg-white hidden group-hover:block" />
                </div>
                <span className="text-white/80 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-white/80 hover:text-white transition-colors italic">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              LOGIN
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="px-3 text-xs text-white/60 uppercase tracking-wider font-semibold">Atau</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Google Login (Main) */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold transition-all border border-transparent hover:border-slate-300 shadow-xl active:scale-[0.98] group"
          >
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <span className="text-blue-600 font-extrabold text-sm">G</span>
            </div>
            <span>Login dengan Google</span>
          </button>

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
