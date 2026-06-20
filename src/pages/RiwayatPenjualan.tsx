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
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-blue-600/20 rounded-xl">
          <History className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Riwayat Penjualan</h2>
          <p className="text-slate-400 text-sm mt-0.5">Laporan pembukuan seluruh akun yang laku terjual</p>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <motion.div variants={itemVariants} className="spotlight-effect relative overflow-hidden group bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between h-32 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] duration-300 before:absolute before:-inset-[2px] before:bg-gradient-to-r before:from-blue-600/0 before:via-blue-300/40 before:to-blue-600/0 before:rounded-2xl before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:-z-10">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider block">Total Terjual</span>
            <span className="text-2xl font-black text-white">{totalSoldUnits} Unit</span>
          </div>
          <div className="absolute bottom-4 right-4 p-2 bg-white/10 text-white rounded-xl border border-white/20">
            <Award className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={itemVariants} className="spotlight-effect relative overflow-hidden group bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between h-32 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] duration-300 before:absolute before:-inset-[2px] before:bg-gradient-to-r before:from-blue-600/0 before:via-blue-300/40 before:to-blue-600/0 before:rounded-2xl before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:-z-10">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider block">Omzet Pendapatan</span>
            <span className="text-2xl font-black text-white">Rp {totalRevenue.toLocaleString('id-ID')}</span>
          </div>
          <div className="absolute bottom-4 right-4 p-2 bg-white/10 text-white rounded-xl border border-white/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div variants={itemVariants} className="spotlight-effect relative overflow-hidden group bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between h-32 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] duration-300 before:absolute before:-inset-[2px] before:bg-gradient-to-r before:from-blue-600/0 before:via-blue-300/40 before:to-blue-600/0 before:rounded-2xl before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:-z-10">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider block">Keuntungan Bersih</span>
            <span className="text-2xl font-black text-white">Rp {totalNetProfit.toLocaleString('id-ID')}</span>
          </div>
          <div className="absolute bottom-4 right-4 p-2 bg-white/10 text-white rounded-xl border border-white/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>
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
                <tr className="bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Spek Akun</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Game & Tier</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Harga Modal</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Harga Jual</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Net Profit</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Pembeli</th>
                  <th className="px-6 py-3.5 border-x border-slate-800/60">Tanggal Laku</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {soldAccounts.map((acc) => {
                  const profit = acc.hargaJual - acc.hargaBeli;
                  return (
                    <motion.tr variants={itemVariants} key={acc.id} className="hover:bg-slate-800/25 transition-colors">
                      <td className="px-6 py-4 border-x border-slate-800/40">
                        <span className="font-bold text-white block truncate max-w-[200px]" title={acc.spec}>{acc.spec}</span>
                        <span className="text-[10px] text-blue-400 font-bold block mt-0.5">{acc.device}</span>
                      </td>
                      <td className="px-6 py-4 border-x border-slate-800/40">
                        <span className="text-slate-200 font-semibold block text-sm">{acc.game}</span>
                        <span className="text-xs text-blue-500 font-semibold">{acc.rank}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-500 border-x border-slate-800/40">
                        Rp {acc.hargaBeli.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-400 border-x border-slate-800/40">
                        Rp {acc.hargaJual.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-300 border-x border-slate-800/40">
                        +Rp {profit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-300 text-xs border-x border-slate-800/40">
                        {acc.pembeli || '-'}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400 border-x border-slate-800/40">
                        {acc.tanggalMasuk || '-'} <span className="text-[10px] text-blue-500">({acc.bulanMasuk})</span>
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
