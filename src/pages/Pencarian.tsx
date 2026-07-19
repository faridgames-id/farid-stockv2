import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X, ShoppingCart, User, Store, Calendar, CreditCard, Gamepad2 } from 'lucide-react';
import { useRequestStore, type RequestOrder } from '../store/useRequestStore';
import { toast } from 'sonner';
import { AlertCard } from '../components/ui/alert-card';

// ─── Shared Animation Variants ───────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
};

const iconPopVariants = {
  initial: { scale: 0, rotate: -15 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 400, damping: 18, delay: 0, bounce: 0.6 },
  },
};

const glowCard = 'transition-all duration-300 border border-slate-800/80 spotlight-effect relative overflow-hidden group';

const Pencarian: React.FC = () => {
  const { orders, addOrder } = useRequestStore();

  // Filter states
  const [query, setQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<'Semua' | 'Free Fire' | 'Mobile Legends'>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'Mencari' | 'Ditemukan' | 'Selesai'>('Semua');

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Request Form states
  const [newPelanggan, setNewPelanggan] = useState('');
  const [newSpec, setNewSpec] = useState('');
  const [newGame, setNewGame] = useState('Free Fire');
  const [newReseller, setNewReseller] = useState('');
  const [newHargaBeli, setNewHargaBeli] = useState('');
  const [newHargaJual, setNewHargaJual] = useState('');
  const [newTanggalBeli, setNewTanggalBeli] = useState('');
  const [newTanggalJual, setNewTanggalJual] = useState('');
  const [newStatusPembayaran, setNewStatusPembayaran] = useState<'Lunas' | 'Cicilan'>('Lunas');
  const [newStatus, setNewStatus] = useState<'Mencari' | 'Ditemukan' | 'Selesai'>('Mencari');

  // Dynamic Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const safeQuery = (query || '').toLowerCase();
      const matchesQuery = 
        (order?.namaPembeli || '').toLowerCase().includes(safeQuery) ||
        (order?.namaReseller || '').toLowerCase().includes(safeQuery) ||
        (order?.spec || '').toLowerCase().includes(safeQuery) ||
        (order?.id || '').toLowerCase().includes(safeQuery);

      const matchesGame = selectedGame === 'Semua' || order?.game === selectedGame;
      const matchesStatus = selectedStatus === 'Semua' || order?.status === selectedStatus;

      return matchesQuery && matchesGame && matchesStatus;
    });
  }, [orders, query, selectedGame, selectedStatus]);

  // Helper to format date inputs
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Handle Form Submit
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPelanggan.trim() || !newSpec.trim() || !newReseller.trim()) {
      toast.custom((t) => (
        <AlertCard
          isVisible={true}
          type="error"
          title="Data Tidak Lengkap"
          description="Mohon lengkapi semua field yang diwajibkan!"
          onDismiss={() => toast.dismiss(t)}
        />
      ));
      return;
    }

    const newOrder: RequestOrder = {
      id: `REQ-${String(orders.length + 1).padStart(3, '0')}`,
      tanggalBeli: newTanggalBeli ? formatDateString(newTanggalBeli) : formatDateString(new Date().toISOString().split('T')[0]),
      tanggalJual: newTanggalJual ? formatDateString(newTanggalJual) : '-',
      namaPembeli: newPelanggan.trim(),
      namaReseller: newReseller.trim(),
      game: newGame,
      spec: newSpec.trim(),
      hargaBeli: Number(newHargaBeli) || 0,
      hargaJual: Number(newHargaJual) || 0,
      statusPembayaran: newStatusPembayaran,
      status: newStatus,
    };

    addOrder(newOrder);
    setIsModalOpen(false);

    // Reset fields
    setNewPelanggan('');
    setNewSpec('');
    setNewReseller('');
    setNewHargaBeli('');
    setNewHargaJual('');
    setNewTanggalBeli('');
    setNewTanggalJual('');
    setNewStatusPembayaran('Lunas');
    setNewStatus('Mencari');
  };

  return (
    <div className="space-y-6 pb-12 text-sans select-none">
      
      {/* Title & Action */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2.5">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0 }} 
            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
          >
            <ShoppingCart className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <div className="flex flex-col justify-center pt-1">
            <h2 className="text-xl font-bold text-white tracking-tight leading-none">Pesanan Request</h2>
            <p className="text-slate-400 text-sm -mt-1 leading-tight">Manajemen data pesanan pelanggan dan margin keuntungan dari reseller pihak ketiga</p>
          </div>
        </motion.div>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98, y: 0 }}
          onClick={() => setIsModalOpen(true)}
          className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-400/30 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all duration-300 cursor-pointer text-sm"
        >
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Tambah Request</span>
        </motion.button>
      </motion.div>

      {/* Control Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
        className={`bg-slate-900 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-md ${glowCard}`}
      >
        {/* Search Input */}
        <div className="w-full flex-grow relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Cari berdasarkan pembeli, reseller, spesifikasi request..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-850/60 border border-slate-700 hover:border-slate-650 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium placeholder-slate-500"
          />
        </div>

        {/* Filters Group (Segmented Controls) */}
        <div className="flex flex-col xl:flex-row gap-5 w-full md:w-auto shrink-0">
          
          {/* Game Selector */}
          <div className="space-y-1 w-full xl:w-auto">
            <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block pl-0.5">GAME</label>
            <div className="flex items-center p-1 bg-slate-800/50 rounded-xl overflow-x-auto hide-scrollbar relative">
              {(['Semua', 'Free Fire', 'Mobile Legends'] as const).map((game) => (
                <button
                  key={game}
                  type="button"
                  onClick={() => setSelectedGame(game)}
                  className={`group relative px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer z-10 ${
                    selectedGame === game 
                      ? 'text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedGame === game && (
                    <motion.div
                      layoutId="game-filter-active"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-400/30 rounded-lg -z-10 shadow-sm overflow-hidden"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                    </motion.div>
                  )}
                  {game === 'Semua' ? 'Semua Game' : game}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selector */}
          <div className="space-y-1 w-full xl:w-auto">
            <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block pl-0.5">STATUS</label>
            <div className="flex items-center p-1 bg-slate-800/50 rounded-xl overflow-x-auto hide-scrollbar relative">
              {(['Semua', 'Mencari', 'Ditemukan', 'Selesai'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`group relative px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer z-10 ${
                    selectedStatus === status 
                      ? 'text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedStatus === status && (
                    <motion.div
                      layoutId="status-filter-active"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-400/30 rounded-lg -z-10 shadow-sm overflow-hidden"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                    </motion.div>
                  )}
                  {status === 'Semua' ? 'Semua Status' : status}
                </button>
              ))}
            </div>
          </div>

        </div>

      </motion.div>

      {/* Request Table Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        className={`spotlight-effect relative group bg-slate-900 rounded-2xl overflow-hidden shadow-sm ${glowCard}`}
      >
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LOG PESANAN REQUEST ({filteredOrders.length})</span>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide pb-2">
            <table className="w-full text-left border-collapse min-w-[1100px] border border-slate-800">
              <thead>
                <tr className="bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <th className="px-6 py-3.5 border border-slate-800">ID & Timeline</th>
                  <th className="px-6 py-3.5 border border-slate-800">Pihak Terkait (Parties)</th>
                  <th className="px-6 py-3.5 border border-slate-800">Spesifikasi Request</th>
                  <th className="px-6 py-3.5 border border-slate-800">Modal (Beli)</th>
                  <th className="px-6 py-3.5 border border-slate-800">Harga Jual</th>
                  <th className="px-6 py-3.5 border border-slate-800">Profit</th>
                  <th className="px-6 py-3.5 border border-slate-800">Status</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-800/40"
              >
                {filteredOrders.map((order) => {
                  const profit = order.hargaJual - order.hargaBeli;
                  return (
                    <motion.tr
                      key={order.id}
                      variants={itemVariants}
                      className="hover:bg-slate-800/30 transition-colors group/row"
                    >
                      {/* 1. ID & TIMELINE */}
                      <td className="px-6 py-4 border border-slate-800">
                        <span className="font-bold text-white block text-sm">{order.id}</span>
                        <div className="text-[10px] text-slate-500 space-y-0.5 mt-1">
                          <p className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0"></span>
                            Beli: {order.tanggalBeli}
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
                            Jual: {order.tanggalJual}
                          </p>
                        </div>
                      </td>

                      {/* 2. PIHAK TERKAIT */}
                      <td className="px-6 py-4 border border-slate-800">
                        <div className="space-y-1">
                          <span className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                            <motion.span variants={iconPopVariants} initial="initial" animate="animate">
                              <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            </motion.span>
                            Pembeli: {order.namaPembeli}
                          </span>
                          <span className="text-slate-400 text-xs flex items-center gap-1.5 pl-0.5">
                            <Store className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            Reseller: {order.namaReseller}
                          </span>
                        </div>
                      </td>

                      {/* 3. SPESIFIKASI */}
                      <td className="px-6 py-4 border border-slate-800">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded inline-block mb-1.5 ${
                          order.game === 'Free Fire' 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                        }`}>
                          {order.game}
                        </span>
                        <span className="text-slate-350 font-medium text-xs block max-w-[280px] leading-relaxed" title={order.spec}>
                          {order.spec}
                        </span>
                      </td>

                      {/* 4. MODAL */}
                      <td className="px-6 py-4 font-semibold text-slate-400 border border-slate-800">
                        Rp {order.hargaBeli.toLocaleString('id-ID')}
                      </td>

                      {/* 5. HARGA JUAL */}
                      <td className="px-6 py-4 border border-slate-800">
                        <span className="font-bold text-blue-400 block">
                          Rp {order.hargaJual.toLocaleString('id-ID')}
                        </span>
                        {order.statusPembayaran === 'Cicilan' && (
                          <span className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                            <CreditCard className="w-2.5 h-2.5 shrink-0" />
                            Cicilan
                          </span>
                        )}
                      </td>

                      {/* 6. PROFIT */}
                      <td className="px-6 py-4 font-bold text-cyan-400 border border-slate-800">
                        +Rp {profit.toLocaleString('id-ID')}
                      </td>

                      {/* 7. STATUS */}
                      <td className="px-6 py-4 border border-slate-800">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Mencari' 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : order.status === 'Ditemukan'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 font-medium border border-slate-800">
            Tidak ada pesanan request yang sesuai filter pencarian Anda.
          </div>
        )}
      </motion.div>

      {/* Add Request Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <form 
            onSubmit={handleAddRequest}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative z-10 text-left space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                Tambah Pesanan Request
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Pembeli */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Pembeli (Customer)</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Ilham Syahputra"
                  value={newPelanggan}
                  onChange={(e) => setNewPelanggan(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium placeholder-slate-500"
                />
              </div>

              {/* Game */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Game</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 cursor-pointer font-medium"
                >
                  <option value="Free Fire" className="bg-slate-900 text-white font-sans font-medium">Free Fire</option>
                  <option value="Mobile Legends" className="bg-slate-900 text-white font-sans font-medium">Mobile Legends</option>
                </select>
              </div>

              {/* Nama Reseller */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Reseller (Source)</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Budi Reseller Indo"
                  value={newReseller}
                  onChange={(e) => setNewReseller(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium placeholder-slate-500"
                />
              </div>

              {/* Status Pembayaran */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Pembayaran</label>
                <select
                  value={newStatusPembayaran}
                  onChange={(e) => setNewStatusPembayaran(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 cursor-pointer font-medium"
                >
                  <option value="Lunas" className="bg-slate-900 text-white font-sans font-medium">Lunas</option>
                  <option value="Cicilan" className="bg-slate-900 text-white font-sans font-medium">Cicilan</option>
                </select>
              </div>

              {/* Tanggal Beli */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Beli</label>
                <input 
                  type="date"
                  value={newTanggalBeli}
                  onChange={(e) => setNewTanggalBeli(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium"
                />
              </div>

              {/* Tanggal Jual */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Jual (Opsional)</label>
                <input 
                  type="date"
                  value={newTanggalJual}
                  onChange={(e) => setNewTanggalJual(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Pesanan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 cursor-pointer font-medium"
                >
                  <option value="Mencari" className="bg-slate-900 text-white font-sans font-medium">Mencari</option>
                  <option value="Ditemukan" className="bg-slate-900 text-white font-sans font-medium">Ditemukan</option>
                  <option value="Selesai" className="bg-slate-900 text-white font-sans font-medium">Selesai</option>
                </select>
              </div>

              {/* Harga Beli */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Modal / Beli</label>
                <input 
                  type="number"
                  required
                  placeholder="Contoh: 400000"
                  value={newHargaBeli}
                  onChange={(e) => setNewHargaBeli(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium placeholder-slate-500"
                />
              </div>

              {/* Harga Jual */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Jual</label>
                <input 
                  type="number"
                  required
                  placeholder="Contoh: 600000"
                  value={newHargaJual}
                  onChange={(e) => setNewHargaJual(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium placeholder-slate-500"
                />
              </div>
            </div>

            {/* Spesifikasi Request */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spesifikasi Request</label>
              <textarea 
                required
                rows={3}
                placeholder="Spesifikasi akun yang dicari..."
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200 font-medium placeholder-slate-500 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 mt-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <motion.button 
                whileHover={{ scale: 1.03, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-blue-400/20 transition-colors cursor-pointer"
              >
                Simpan Request
              </motion.button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Pencarian;
