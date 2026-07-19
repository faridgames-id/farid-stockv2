import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, BookmarkPlus, ShoppingBag, AlertCircle, Wallet, CheckCircle } from 'lucide-react';
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
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <motion.div 
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0 }} 
            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
          >
            <BookmarkPlus className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <div className="flex flex-col justify-center pt-1">
            <h2 className="text-xl font-bold text-white tracking-tight leading-none">Wishlist Expansi</h2>
            <p className="text-slate-400 text-sm -mt-1 leading-tight">Kelola daftar kebutuhan untuk ekspansi bisnis</p>
          </div>
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
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Barang</label>
              <input 
                {...register('namaBarang', { required: true })} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="Misal: Monitor 24 inch" 
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
              <select 
                {...register('kategori')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
              >
                <option value="Peralatan">Peralatan</option>
                <option value="Furniture">Furniture</option>
                <option value="Software">Software</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Harga (Rp)</label>
              <input 
                type="number" 
                {...register('estimasiHarga', { required: true })} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold placeholder-slate-500" 
                placeholder="0" 
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prioritas</label>
              <select 
                {...register('prioritas')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div>
            <div className="lg:col-span-2 space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spesifikasi Detail</label>
              <input 
                {...register('spesifikasi')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="Detail spesifikasi..." 
              />
            </div>
            <div className="lg:col-span-2 space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link / Toko</label>
              <input 
                {...register('linkToko')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="https://..." 
              />
            </div>
            <div className="lg:col-span-3 space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catatan Tambahan</label>
              <input 
                {...register('catatan')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500" 
                placeholder="Catatan..." 
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select 
                {...register('statusPembelian')} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
              >
                <option value="Belum">Belum Dibeli</option>
                <option value="Sudah Terima">Sudah Terima</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <motion.button 
              whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.96 }}
              type="submit" 
              className="w-full md:w-auto justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-xl font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-blue-400/20 transition-colors"
            >
              Simpan Target
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.04 } }
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Item */}
        <motion.div 
          onClick={() => {}}
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.96, rotate: -1, y: 2 }}
          className="relative overflow-hidden group bg-gradient-to-br from-cyan-400 to-blue-600 rounded-[24px] p-5 sm:p-6 border border-cyan-300/30 shadow-none hover:shadow-none transition-all duration-300 cursor-pointer"
        >
          {/* MOTIF: Micro-bubbles / Buih Melayang */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none z-0" />
          <div className="absolute top-4 left-6 w-3 h-3 bg-white/10 rounded-full group-hover:-translate-y-4 group-hover:scale-125 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute top-10 left-16 w-2 h-2 bg-white/20 rounded-full group-hover:-translate-y-6 group-hover:scale-150 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-6 left-12 w-4 h-4 bg-white/5 rounded-full group-hover:-translate-y-5 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/10 rounded-full group-hover:-translate-y-8 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-4 right-10 w-5 h-5 bg-gradient-to-tr from-white/10 to-transparent rounded-full group-hover:-translate-y-4 group-hover:-translate-x-2 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute -bottom-2 right-4 w-8 h-8 bg-white/5 rounded-full group-hover:-translate-y-6 group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] text-cyan-100 font-extrabold uppercase tracking-widest drop-shadow-sm">Total Item</p>
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-[12px] sm:rounded-[14px] border border-white/20 shadow-sm group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">{totalItem}</p>
          </div>
        </motion.div>
        
        <motion.div 
          onClick={() => {}}
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.96, rotate: -1, y: 2 }}
          className="relative overflow-hidden group bg-gradient-to-br from-sky-400 to-blue-600 rounded-[24px] p-5 sm:p-6 border border-sky-300/30 shadow-none hover:shadow-none transition-all duration-300 cursor-pointer"
        >
          {/* MOTIF: Micro-bubbles / Buih Melayang */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none z-0" />
          <div className="absolute top-4 left-6 w-3 h-3 bg-white/10 rounded-full group-hover:-translate-y-4 group-hover:scale-125 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute top-10 left-16 w-2 h-2 bg-white/20 rounded-full group-hover:-translate-y-6 group-hover:scale-150 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-6 left-12 w-4 h-4 bg-white/5 rounded-full group-hover:-translate-y-5 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/10 rounded-full group-hover:-translate-y-8 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-4 right-10 w-5 h-5 bg-gradient-to-tr from-white/10 to-transparent rounded-full group-hover:-translate-y-4 group-hover:-translate-x-2 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute -bottom-2 right-4 w-8 h-8 bg-white/5 rounded-full group-hover:-translate-y-6 group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] text-sky-100 font-extrabold uppercase tracking-widest drop-shadow-sm">Prioritas Tinggi</p>
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-[12px] sm:rounded-[14px] border border-white/20 shadow-sm group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">{prioritasTinggi}</p>
          </div>
        </motion.div>
        
        <motion.div 
          onClick={() => {}}
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.96, rotate: -1, y: 2 }}
          className="relative overflow-hidden group bg-gradient-to-br from-blue-600 to-blue-900 rounded-[24px] p-5 sm:p-6 border border-blue-500/30 shadow-none hover:shadow-none transition-all duration-300 cursor-pointer"
        >
          {/* MOTIF: Micro-bubbles / Buih Melayang */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none z-0" />
          <div className="absolute top-4 left-6 w-3 h-3 bg-white/10 rounded-full group-hover:-translate-y-4 group-hover:scale-125 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute top-10 left-16 w-2 h-2 bg-white/20 rounded-full group-hover:-translate-y-6 group-hover:scale-150 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-6 left-12 w-4 h-4 bg-white/5 rounded-full group-hover:-translate-y-5 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/10 rounded-full group-hover:-translate-y-8 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-4 right-10 w-5 h-5 bg-gradient-to-tr from-white/10 to-transparent rounded-full group-hover:-translate-y-4 group-hover:-translate-x-2 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute -bottom-2 right-4 w-8 h-8 bg-white/5 rounded-full group-hover:-translate-y-6 group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] text-blue-200/90 font-extrabold uppercase tracking-widest drop-shadow-sm">Total Estimasi</p>
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-[12px] sm:rounded-[14px] border border-white/20 shadow-sm group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-white drop-shadow-md truncate">Rp {totalEstimasi.toLocaleString('id-ID')}</p>
          </div>
        </motion.div>

        <motion.div 
          onClick={() => {}}
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.96, rotate: -1, y: 2 }}
          className="relative overflow-hidden group bg-gradient-to-br from-teal-400 to-blue-600 rounded-[24px] p-5 sm:p-6 border border-teal-300/30 shadow-none hover:shadow-none transition-all duration-300 cursor-pointer"
        >
          {/* MOTIF: Micro-bubbles / Buih Melayang */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none z-0" />
          <div className="absolute top-4 left-6 w-3 h-3 bg-white/10 rounded-full group-hover:-translate-y-4 group-hover:scale-125 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute top-10 left-16 w-2 h-2 bg-white/20 rounded-full group-hover:-translate-y-6 group-hover:scale-150 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-6 left-12 w-4 h-4 bg-white/5 rounded-full group-hover:-translate-y-5 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/10 rounded-full group-hover:-translate-y-8 transition-transform duration-300 ease-out pointer-events-none z-0" />
          <div className="absolute bottom-4 right-10 w-5 h-5 bg-gradient-to-tr from-white/10 to-transparent rounded-full group-hover:-translate-y-4 group-hover:-translate-x-2 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/20" />
          <div className="absolute -bottom-2 right-4 w-8 h-8 bg-white/5 rounded-full group-hover:-translate-y-6 group-hover:scale-110 transition-transform duration-300 ease-out pointer-events-none z-0 border border-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] text-teal-100 font-extrabold uppercase tracking-widest drop-shadow-sm">Sudah Terima</p>
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-[12px] sm:rounded-[14px] border border-white/20 shadow-sm group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">{sudahTerima}</p>
          </div>
        </motion.div>
      </motion.div>

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
