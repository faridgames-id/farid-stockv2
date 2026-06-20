import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '../store/useWishlistStore';
import { useGlobalFilter } from '../hooks/useGlobalFilter';
import PageMotionWrapper, { itemVariants } from '../components/PageMotionWrapper';

const Wishlist: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<WishlistItem>();
  const { items, addItem, removeItem } = useWishlistStore();
  const { filterWishlist } = useGlobalFilter();
  const filteredItems = filterWishlist(items);

  const onSubmit = (data: WishlistItem) => {
    const newItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      estimasiHarga: Number(data.estimasiHarga)
    };
    addItem(newItem);
    reset();
  };

  const totalItem = filteredItems.length;
  const prioritasTinggi = filteredItems.filter(i => i.prioritas === 'Tinggi').length;
  const totalEstimasi = filteredItems.reduce((acc, curr) => acc + curr.estimasiHarga, 0);
  const sudahTerima = filteredItems.filter(i => i.statusPembelian === 'Sudah Terima').length;

  return (
    <PageMotionWrapper className="space-y-6 text-sans select-none">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Wishlist Expansi</h2>
          <p className="text-slate-400 text-sm mt-0.5">Kelola daftar kebutuhan untuk ekspansi bisnis</p>
        </div>
      </div>

      {/* Form Section */}
      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm spotlight-effect">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          Tambah Wishlist Barang Bisnis
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Barang</label>
              <input 
                {...register('namaBarang', { required: true })} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="Misal: Monitor 24 inch" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
              <select 
                {...register('kategori')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
              >
                <option value="Peralatan">Peralatan</option>
                <option value="Furniture">Furniture</option>
                <option value="Software">Software</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Harga (Rp)</label>
              <input 
                type="number" 
                {...register('estimasiHarga', { required: true })} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold placeholder-slate-500" 
                placeholder="0" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prioritas</label>
              <select 
                {...register('prioritas')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spesifikasi Detail</label>
              <input 
                {...register('spesifikasi')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="Detail spesifikasi..." 
              />
            </div>
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link / Toko</label>
              <input 
                {...register('linkToko')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="https://..." 
              />
            </div>
            <div className="lg:col-span-3 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catatan Tambahan</label>
              <input 
                {...register('catatan')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="Catatan..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select 
                {...register('statusPembelian')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
              >
                <option value="Belum">Belum Dibeli</option>
                <option value="Sudah Terima">Sudah Terima</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              Simpan Wishlist
            </button>
          </div>
        </form>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 shadow-sm spotlight-effect">
          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Total Item</p>
          <p className="text-2xl font-black text-white mt-1.5">{totalItem}</p>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-600/20 rounded-2xl p-5 shadow-sm spotlight-effect">
          <p className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider">Prioritas Tinggi</p>
          <p className="text-2xl font-black text-white mt-1.5">{prioritasTinggi}</p>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 shadow-sm spotlight-effect">
          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Total Estimasi</p>
          <p className="text-2xl font-black text-white mt-1.5">Rp {totalEstimasi.toLocaleString('id-ID')}</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/20 rounded-2xl p-5 shadow-sm spotlight-effect">
          <p className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider">Sudah Terima</p>
          <p className="text-2xl font-black text-white mt-1.5">{sudahTerima}</p>
        </motion.div>
      </div>

      {/* Data Table */}
      <motion.div variants={itemVariants} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm spotlight-effect relative group">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold text-white">Daftar Wishlist</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari barang..." 
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-64" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase">Barang & Kategori</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase">Spesifikasi</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase">Estimasi Harga</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase">Prioritas</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-200">{item.namaBarang}</p>
                    <p className="text-xs text-slate-500">{item.kategori}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300 truncate max-w-[200px]" title={item.spesifikasi}>{item.spesifikasi}</p>
                    {item.linkToko && (
                      <a href={item.linkToko} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">Link Toko</a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-200">Rp {item.estimasiHarga.toLocaleString('id-ID')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      item.prioritas === 'Tinggi' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      item.prioritas === 'Sedang' ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.prioritas}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.statusPembelian === 'Sudah Terima' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                        <CheckCircle2 className="w-4 h-4" /> Diterima
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <XCircle className="w-4 h-4" /> Belum
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-slate-800 rounded transition-colors" title="Hapus" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Belum ada data wishlist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageMotionWrapper>
  );
};

export default Wishlist;
