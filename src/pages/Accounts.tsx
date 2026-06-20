import React from 'react';
import { Search, Filter, Copy } from 'lucide-react';

const Accounts: React.FC = () => {
  // Placeholder minimal UI for accounts
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-800">Inventaris Akun</h2>
        <button className="py-2.5 px-5 bg-royal-blue hover:bg-royal-blue-hover text-white rounded-xl font-medium shadow-sm shadow-blue-500/20 smooth-transition active:scale-[0.98]">
          + Tambah Akun
        </button>
      </div>

      <div className="bg-pure-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari ID, Tier, atau Skin..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-royal-blue focus:ring-1 focus:ring-royal-blue smooth-transition"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-center gap-2 smooth-transition">
            <Filter className="w-4 h-4" /> Filter Spesifik
          </button>
        </div>

        <div className="mt-6 text-center py-12 text-slate-500">
          <p>Tabel Virtual Scrolling dengan 1-Click Copy akan diimplementasikan di Phase 2.</p>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
