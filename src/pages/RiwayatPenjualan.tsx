import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp, DollarSign, Award, Users } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGlobalFilter } from '../hooks/useGlobalFilter';
import PageMotionWrapper, { itemVariants } from '../components/PageMotionWrapper';

const RiwayatPenjualan: React.FC = () => {
  const { accounts } = useInventoryStore();
  const { filterAccounts } = useGlobalFilter();

  // Filter only sold accounts
  const soldAccounts = useMemo(() => {
    return filterAccounts(accounts).filter(acc => acc.status === 'Terjual');
  }, [accounts, filterAccounts]);

  // Aggregate statistics using custom pure profit logic: (Harga Jual Real - Modal)
  const totalSoldUnits = soldAccounts.length;
  const totalRevenue = soldAccounts.reduce((sum, acc) => sum + acc.hargaJual, 0);
  const totalModal = soldAccounts.reduce((sum, acc) => sum + acc.hargaBeli, 0);
  const totalNetProfit = soldAccounts.reduce((sum, acc) => sum + (acc.hargaJual - acc.hargaBeli), 0);

  return (
    <PageMotionWrapper className="space-y-6 pb-12 text-sans select-none">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <motion.div 
          initial={{ x: 40, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0 }} 
          className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
        >
          <History className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
        <div className="flex flex-col justify-center pt-1">
          <h2 className="text-xl font-bold text-white tracking-tight leading-none">Riwayat Penjualan</h2>
          <p className="text-slate-400 text-sm mt-0.5">Laporan pembukuan seluruh akun yang laku terjual</p>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { title: 'TOTAL TERJUAL', val: totalSoldUnits, sub: 'Unit', icon: Award, color: 'from-sky-400 to-blue-500' },
          { title: 'OMZET PENDAPATAN', val: `Rp ${totalRevenue.toLocaleString('id-ID')}`, sub: 'Pemasukan kotor', icon: DollarSign, color: 'from-blue-500 to-indigo-600' },
          { title: 'KEUNTUNGAN BERSIH', val: `Rp ${totalNetProfit.toLocaleString('id-ID')}`, sub: 'Profit murni', icon: TrendingUp, color: 'from-cyan-400 to-sky-500' }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} 
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.95, rotate: -1, y: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
            className={`relative overflow-hidden group bg-gradient-to-br ${item.color} p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] flex flex-col justify-between min-h-[140px] sm:min-h-[160px] text-white shadow-lg shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer border-none`}
          >
            {/* MOTIF: 3D Glass Background Bubbles */}
            {/* Huge bottom-right outer bubble */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tl from-white/10 via-white/5 to-transparent rounded-full group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
            {/* Inner bottom-right bubble for depth */}
            <div className="absolute -bottom-6 -right-6 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-white/20 to-transparent rounded-full group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none z-0 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)] border border-white/20" />
            
            {/* Small top-right floating bubble */}
            <div className="absolute top-6 right-12 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-white/20 to-white/5 rounded-full group-hover:-translate-y-2 group-hover:translate-x-1 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]" />
            
            {/* Top-left Icon */}
            <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
            </div>

            {/* Bottom-left Content */}
            <div className="relative z-10 space-y-1 mt-6">
              <span className="text-[10px] sm:text-[11px] text-white/90 font-bold uppercase tracking-[0.1em] block drop-shadow-sm">{item.title}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[26px] sm:text-[32px] font-extrabold text-white drop-shadow-md tracking-tight leading-none">{item.val}</span>
                {item.title === 'TOTAL TERJUAL' && <span className="text-xs sm:text-sm font-bold text-white/90 drop-shadow-sm ml-1">{item.sub}</span>}
              </div>
              {item.title !== 'TOTAL TERJUAL' && <p className="text-[10px] sm:text-[11px] text-white/80 font-medium">{item.sub}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm spotlight-effect relative group">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LOG PENJUALAN</span>
        </div>

        {soldAccounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Spek Akun</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Game & Tier</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Harga Modal</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Harga Jual</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Net Profit</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Pembeli</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Tanggal Laku</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-display">
                {soldAccounts.map((acc) => {
                  const profit = acc.hargaJual - acc.hargaBeli;
                  return (
                    <motion.tr variants={itemVariants} key={acc.id} className="hover:bg-slate-800/25 transition-colors">
                      <td className="px-6 py-4 border-x border-slate-800/40">
                        <span className="text-sm font-bold text-white block truncate max-w-[200px]" title={acc.spec}>{acc.spec}</span>
                        <span className="text-xs font-semibold text-blue-400 block mt-0.5 uppercase tracking-wide">{acc.device}</span>
                      </td>
                      <td className="px-6 py-4 border-x border-slate-800/40">
                        <span className="text-sm font-semibold text-slate-200 block">{acc.game}</span>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">{acc.rank}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-400 border-x border-slate-800/40">
                        Rp {acc.hargaBeli.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-400 border-x border-slate-800/40">
                        Rp {acc.hargaJual.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-400 border-x border-slate-800/40">
                        +Rp {profit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-300 border-x border-slate-800/40">
                        {acc.pembeli || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-400 border-x border-slate-800/40">
                        {acc.tanggalMasuk || '-'} <span className="text-xs font-bold text-blue-500 ml-1">({acc.bulanMasuk})</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 font-medium">
            Belum ada data transaksi penjualan terdaftar.
          </div>
        )}
      </div>
    </PageMotionWrapper>
  );
};

export default RiwayatPenjualan;
