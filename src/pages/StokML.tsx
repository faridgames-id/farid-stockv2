import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PaymentModal from '../components/PaymentModal';
import CicilanPromptModal from '../components/CicilanPromptModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SellConfirmModal from '../components/SellConfirmModal';
import LunasConfirmModal from '../components/LunasConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Package, CheckCircle, Trash2, Search, Pencil, DollarSign, CreditCard, Calendar, Copy, X, Check, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useInventoryStore } from '../store/useInventoryStore';
import type { AccountItem } from '../store/useInventoryStore';
import { useGlobalFilter } from '../hooks/useGlobalFilter';
import PageMotionWrapper, { itemVariants } from '../components/PageMotionWrapper';
import FormSelect from '../components/FormSelect';

const StokML: React.FC = () => {
  const { register, handleSubmit, reset, control } = useForm<AccountItem>();
  const { accounts, addAccount, removeAccount, updateAccountStatus, editAccount, tambahCicilan } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<'Ready' | 'Terjual' | 'Cicilan'>('Ready');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
  const [calendarEditingAccount, setCalendarEditingAccount] = useState<AccountItem | null>(null);
  const [paymentModalAccount, setPaymentModalAccount] = useState<AccountItem | null>(null);
  const [cicilanPromptAccount, setCicilanPromptAccount] = useState<AccountItem | null>(null);
  const [deletePromptAccount, setDeletePromptAccount] = useState<AccountItem | null>(null);
  const [sellPromptAccount, setSellPromptAccount] = useState<AccountItem | null>(null);
  const [lunasPromptAccount, setLunasPromptAccount] = useState<AccountItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { filterAccounts } = useGlobalFilter();
  const { highlightAccountId, setHighlightAccountId } = useAppStore();

  // Memoized: only recalculates when accounts or global filter changes
  const mlAccounts = useMemo(
    () => filterAccounts(accounts.filter(acc => acc.game === 'Mobile Legends')),
    [accounts, filterAccounts]
  );

  // Auto-switch tab if navigated from other page with highlight
  React.useEffect(() => {
    if (highlightAccountId) {
      const targetAcc = accounts.find(a => a.id === highlightAccountId);
      if (targetAcc) setActiveTab(targetAcc.status as 'Ready' | 'Terjual' | 'Cicilan');
      const timer = setTimeout(() => setHighlightAccountId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightAccountId, accounts, setHighlightAccountId]);

  const filteredAccounts = useMemo(
    () => mlAccounts.filter(acc =>
      acc.status === activeTab &&
      (acc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       acc.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
       acc.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (acc.pembeli && acc.pembeli.toLowerCase().includes(searchTerm.toLowerCase())) ||
       acc.namaPenjual.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [mlAccounts, activeTab, searchTerm]
  );

  const onSubmit = (data: AccountItem) => {
    const nextIdNum = mlAccounts.length + 1;
    const generatedId = `ML-${String(nextIdNum).padStart(3, '0')}`;
    const newAccount: AccountItem = {
      ...data,
      id: generatedId,
      game: 'Mobile Legends',
      hargaBeli: Number(data.hargaBeli),
      hargaJual: Number(data.hargaJual),
      targetJual: data.targetJual ? Number(data.targetJual) : 0,
      pembeli: data.pembeli || '',
    };
    addAccount(newAccount);
    reset();
  };

  const handleCopy = (acc: AccountItem) => {
    const text = `SPEK ⬇️
📦 [ ${acc.spec} - ${acc.rank} ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Halo Kak, terima kasih telah bertransaksi di Farid Shop Game. 
Berikut adalah detail akun yang Anda beli:

🎮 GAME       : Mobile Legends
📌 CATATAN  : ${acc.catatan || '-'}
🔗 LOGIN VIA  : ${acc.loginVia || '-'}

⚠️ DATA UTAMA LOGIN ⚠️
✉️ EMAIL     : ${acc.email}
🔑 PASSWORD  : ${acc.password || '-'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PANDUAN KEAMANAN & GARANSI (WAJIB DIBACA):
1. Mohon jangan langsung mengganti password/data keamanan akun Google/Moonton dalam 24 jam pertama. Sistem keamanan game dapat mendeteksi ini sebagai aktivitas mencurigakan (risiko banned/sesi terkunci).
2. Simpan data login ini di tempat yang aman.
3. Garansi Alrefull/Kontak GM berlaku selama 30 hari sejak data dikirimkan.
4. Garansi otomatis tidak berlaku jika akun dipindahtangankan/dijual kembali kepada orang lain.

Terima kasih atas kepercayaan Anda, selamat bermain!
Farid Shop Game ©️ 2026 | Safe - Fast - Trusted`;
    navigator.clipboard.writeText(text);
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Edit Modal form handler
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm<AccountItem>();

  const openEditModal = (acc: AccountItem) => {
    setEditingAccount(acc);
    resetEdit(acc);
  };

  const onEditSubmit = (data: AccountItem) => {
    if (editingAccount) {
      const updated: AccountItem = {
        ...editingAccount,
        ...data,
        hargaBeli: Number(data.hargaBeli),
        hargaJual: Number(data.hargaJual),
        targetJual: data.targetJual ? Number(data.targetJual) : 0,
      };
      editAccount(updated);
      setEditingAccount(null);
    }
  };

  const handleCalendarSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (calendarEditingAccount) {
      const formData = new FormData(e.currentTarget);
      const tanggal = formData.get('tanggalMasuk') as string;
      const bulan = formData.get('bulanMasuk') as string;
      
      const updated: AccountItem = {
        ...calendarEditingAccount,
        tanggalMasuk: tanggal,
        bulanMasuk: bulan,
      };
      editAccount(updated);
      setCalendarEditingAccount(null);
    }
  };

  return (
    <PageMotionWrapper className="space-y-6 pb-12">
      <motion.div variants={itemVariants} className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
        >
          <Package className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white tracking-tight leading-none">Stok Mobile Legends</h2>
          <p className="text-slate-400 text-sm -mt-2.5">Kelola inventaris dan tambah akun Mobile Legends</p>
        </div>
      </motion.div>

      {/* Input Form (Tambah Akun) */}
      <motion.div variants={itemVariants} className="spotlight-effect relative group bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-start sm:items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 sm:mt-0 active:rotate-180 hover:rotate-90 transition-transform duration-300 cursor-pointer" />
            <span>Input Form (Tambah Akun Mobile Legends)</span>
          </h2>
          <span className="self-start sm:self-auto px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0">
            ML Edition
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spesifikasi Akun</label>
              <input 
                type="text" 
                {...register('spec', { required: true })}
                placeholder="Contoh: Skin KOF / Legend" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rank / Level</label>
              <Controller
                name="rank"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { value: "IMORTAL", label: "IMORTAL" },
                      { value: "MYTHIC GLORY", label: "MYTHIC GLORY" },
                      { value: "MYTHIC HONOR", label: "MYTHIC HONOR" },
                      { value: "MYTHIC", label: "MYTHIC" },
                      { value: "LEGEND", label: "LEGEND" }
                    ]}
                    placeholder="-- Pilih Rank --"
                    buttonClassName="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Beli (IDR)</label>
              <input 
                type="number" 
                {...register('hargaBeli', { required: true })}
                placeholder="Rp 0" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Jual Laku (IDR)</label>
              <input 
                type="number" 
                {...register('hargaJual', { required: true })}
                placeholder="Rp 0" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-blue-400" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Jual (IDR)</label>
              <input 
                type="number" 
                {...register('targetJual')}
                placeholder="Rp 0" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-blue-400" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Penjual (Seller)</label>
              <input 
                type="text" 
                {...register('namaPenjual', { required: true })}
                placeholder="Contoh: Budi" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Pembeli (Buyer)</label>
              <input 
                type="text" 
                {...register('pembeli')}
                placeholder="Contoh: Roni (Kosongkan jika Ready)" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Jual (Jika Terjual)</label>
              <input 
                type="text" 
                {...register('tanggalJual')}
                placeholder="Contoh: 12/06/2026 atau YYYY-MM-DD" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email / Akun Login</label>
              <input 
                type="text" 
                {...register('email', { required: true })}
                placeholder="email@login.com / 0812..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password Akun</label>
              <input 
                type="password" 
                {...register('password')}
                placeholder="Password login..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Login Via</label>
              <Controller
                name="loginVia"
                control={control}
                
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { value: "Google", label: "Google" },
                      { value: "Bind 0", label: "Bind 0" },
                      { value: "Rebind", label: "Rebind" },
                      { value: "Moonton", label: "Moonton" }
                    ]}
                    placeholder="-- Pilih Login --"
                    buttonClassName="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Keterangan Status</label>
              <Controller
                name="status"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { value: "Ready", label: "Ready" },
                      { value: "Terjual", label: "Terjual" },
                      { value: "Cicilan", label: "Cicilan" }
                    ]}
                    placeholder="-- Pilih Status --"
                    buttonClassName="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merk HP / Device</label>
              <input 
                type="text" 
                list="device-options"
                {...register('device', { required: true })}
                placeholder="Pilih atau ketik sendiri..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
              <datalist id="device-options">
                <option value="INFINIX HOT 60" />
                <option value="REDMI NOTE 14" />
                <option value="REALME NARZO" />
                <option value="IPHONE 13" />
                <option value="IPHONE 15" />
                <option value="REDMI 13" />
                <option value="REDMI 10 2022" />
                <option value="TABLET" />
                <option value="LAPTOP" />
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catatan Tambahan</label>
              <Controller
                name="catatan"
                control={control}
                
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { value: "ALLKOS", label: "ALLKOS" },
                      { value: "( - ) PLAT", label: "( - ) PLAT" }
                    ]}
                    placeholder="- Kosong -"
                    buttonClassName="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bulan Masuk Stok</label>
              <Controller
                name="bulanMasuk"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { value: "Januari", label: "Januari" },
                      { value: "Februari", label: "Februari" },
                      { value: "Maret", label: "Maret" },
                      { value: "April", label: "April" },
                      { value: "Mei", label: "Mei" },
                      { value: "Juni", label: "Juni" },
                      { value: "Juli", label: "Juli" },
                      { value: "Agustus", label: "Agustus" },
                      { value: "September", label: "September" },
                      { value: "Oktober", label: "Oktober" },
                      { value: "November", label: "November" },
                      { value: "Desember", label: "Desember" }
                    ]}
                    placeholder="-- Pilih Bulan --"
                    buttonClassName="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5 min-w-0 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Masuk (Opsional)</label>
              <input 
                type="date" 
                {...register('tanggalMasuk')}
                className="w-full min-w-0 appearance-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="group relative overflow-hidden w-full md:w-auto justify-center bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-400/30 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center gap-2">
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
              <CheckCircle className="w-5 h-5 relative z-10" /> 
              <span className="relative z-10">Simpan Entri Akun ML</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Inventory Table */}
      <motion.div variants={itemVariants} className="spotlight-effect relative group bg-slate-900 rounded-2xl border border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              Inventaris Akun Mobile Legends
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari ID, Tier, Spec, Penjual, Pembeli..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-64" 
              />
            </div>
            <div className="grid grid-cols-3 sm:flex gap-2 p-1 bg-slate-800 rounded-lg border border-slate-700 relative w-full sm:w-auto">
              {(['Ready', 'Terjual', 'Cicilan'] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`group relative z-10 w-full sm:w-auto px-4 py-1.5 rounded-md text-sm font-bold transition-colors text-center ${
                    activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabIndicatorML"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-400/30 rounded-md shadow-sm overflow-hidden"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    >
                      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                    </motion.div>
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max border border-slate-800">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-4 py-4 border border-slate-800">NO</th>
                <th className="px-4 py-4 border border-slate-800">SPESIFIKASI</th>
                <th className="px-4 py-4 border border-slate-800">RANK/LEVEL</th>
                <th className="px-4 py-4 border border-slate-800">HARGA BELI</th>
                <th className="px-4 py-4 border border-slate-800">HARGA JUAL</th>
                {activeTab === 'Terjual' ? (
                  <th className="px-4 py-4 border border-slate-800 text-emerald-400">PROFIT</th>
                ) : (
                  <th className="px-4 py-4 border border-slate-800">TARGET JUAL</th>
                )}
                {activeTab === 'Cicilan' && (
                  <>
                    <th className="px-4 py-4 border border-slate-800 text-emerald-400">SUDAH BAYAR</th>
                    <th className="px-4 py-4 border border-slate-800 text-indigo-400">TOTAL TAGIHAN</th>
                    <th className="px-4 py-4 border border-slate-800 text-red-400">SISA CICILAN</th>
                  </>
                )}
                <th className="px-4 py-4 border border-slate-800">PENJUAL</th>
                <th className="px-4 py-4 border border-slate-800">PEMBELI</th>
                <th className="px-4 py-4 border border-slate-800">EMAIL AKUN</th>
                <th className="px-4 py-4 border border-slate-800">LOGIN VIA</th>
                <th className="px-4 py-4 border border-slate-800">KETERANGAN</th>
                <th className="px-4 py-4 border border-slate-800">DEVICE</th>
                {activeTab === 'Terjual' ? (
                  <th className="px-4 py-4 border border-slate-800">TANGGAL JUAL</th>
                ) : (
                  <th className="px-4 py-4 border border-slate-800">TANGGAL MASUK</th>
                )}
                <th className="px-4 py-4 text-center border border-slate-800">AKSI</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredAccounts.map((acc, index) => (
                  <motion.tr 
                    key={acc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-slate-800/30 transition-colors font-sans tracking-wide"
                  >
                    <td className="px-4 py-4 text-slate-400 font-bold border border-slate-800">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 border border-slate-800">
                      <span className="font-semibold text-white block max-w-[180px] truncate" title={acc.spec}>{acc.spec}</span>
                      <span className="text-[10px] text-blue-400 font-bold uppercase block mt-0.5">{acc.id}</span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-300 border border-slate-800">
                      {acc.rank}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-400 border border-slate-800">
                      Rp {acc.hargaBeli.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4 font-bold text-blue-400 border border-slate-800">
                      Rp {acc.hargaJual.toLocaleString('id-ID')}
                    </td>
                    {activeTab === 'Terjual' ? (
                      <td className="px-4 py-4 font-bold text-emerald-400 border border-slate-800">
                        Rp {((acc.hargaJual || 0) - (acc.hargaBeli || 0)).toLocaleString('id-ID')}
                      </td>
                    ) : (
                      <td className="px-4 py-4 font-bold text-blue-300 border border-slate-800">
                        Rp {(acc.targetJual || 0).toLocaleString('id-ID')}
                      </td>
                    )}
                    {activeTab === 'Cicilan' && (
                      <>
                        <td className="px-4 py-4 font-bold text-emerald-400 border border-slate-800">
                          Rp {(acc.totalDibayar || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-4 font-bold text-indigo-400 border border-slate-800">
                          Rp {((acc.targetJual || acc.hargaJual) || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-4 font-bold text-red-400 border border-slate-800">
                          Rp {(((acc.targetJual || acc.hargaJual) || 0) - (acc.totalDibayar || 0)).toLocaleString('id-ID')}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-4 text-slate-300 font-medium border border-slate-800">
                      {acc.namaPenjual}
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-medium border border-slate-800">
                      {acc.pembeli || '-'}
                    </td>
                    <td className="px-4 py-4 text-slate-200 font-medium text-sm truncate max-w-[150px] border border-slate-800" title={acc.email}>
                      {acc.email}
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-medium text-sm border border-slate-800">
                      {acc.loginVia || '-'}
                    </td>
                    <td className="px-4 py-4 border border-slate-800">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase ${
                        acc.status === 'Ready' 
                          ? 'border border-blue-500/50 text-blue-400 bg-transparent shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                          : acc.status === 'Terjual'
                          ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                          : 'border border-dashed border-blue-400/50 text-blue-300 bg-transparent'
                      }`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm border border-slate-800">
                      {acc.device}
                    </td>
                    {activeTab === 'Terjual' ? (
                      <td className="px-4 py-4 text-slate-400 text-sm border border-slate-800">
                        {acc.tanggalJual || '-'}
                      </td>
                    ) : (
                      <td className="px-4 py-4 text-slate-400 text-sm border border-slate-800">
                        {acc.tanggalMasuk || '-'} <span className="text-xs text-blue-500">({acc.bulanMasuk})</span>
                      </td>
                    )}
                    <td className="px-4 py-4 text-center border border-slate-800">
                      <div className="flex items-center justify-center gap-1.5">
                        {acc.status === 'Cicilan' ? (
                          <>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopy(acc)}
                              title="Salin Data Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-blue-600 border border-blue-500 text-white hover:bg-blue-500 hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all relative cursor-pointer"
                            >
                              <Copy className="w-5 h-5 sm:w-4 sm:h-4" />
                              {copiedId === acc.id && (
                                <span className="absolute -top-8 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-lg border border-blue-400 font-bold whitespace-nowrap animate-bounce">
                                  Copied!
                                </span>
                              )}
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(acc)}
                              title="Edit Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                            >
                              <Pencil className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>
                            
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPaymentModalAccount(acc)}
                              title="Bayar Cicilan"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all cursor-pointer"
                            >
                              <DollarSign className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setLunasPromptAccount(acc)}
                              title="Tandai Ready (Selesai Cicilan)"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-green-500 border border-green-400 text-white hover:bg-green-400 hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-all cursor-pointer"
                            >
                              <CheckCircle className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeletePromptAccount(acc)}
                              title="Hapus Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>
                          </>
                        ) : acc.status === 'Terjual' ? (
                          <>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(acc)}
                              title="Edit Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                              <Pencil className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>
                            
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSellPromptAccount(acc)}
                              title="Edit Penjualan"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/50 transition-all cursor-pointer"
                            >
                              <DollarSign className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeletePromptAccount(acc)}
                              title="Hapus Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopy(acc)}
                              title="Salin Data Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-blue-600 border border-blue-500 text-white hover:bg-blue-500 hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all relative cursor-pointer"
                            >
                              <Copy className="w-5 h-5 sm:w-4 sm:h-4" />
                              {copiedId === acc.id && (
                                <span className="absolute -top-8 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-lg border border-blue-400 font-bold whitespace-nowrap animate-bounce">
                                  Copied!
                                </span>
                              )}
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeletePromptAccount(acc)}
                              title="Hapus Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setCalendarEditingAccount(acc)}
                              title="Ubah Tanggal Masuk"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                              <Calendar className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(acc)}
                              title="Edit Akun"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                              <Pencil className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>
                            
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSellPromptAccount(acc)}
                              title="Tandai Terjual"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                              <DollarSign className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setCicilanPromptAccount(acc)}
                              title="Tandai Cicilan"
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                              <CreditCard className="w-5 h-5 sm:w-4 sm:h-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredAccounts.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-medium">
            Tidak ada akun Mobile Legends dengan status {activeTab}.
          </div>
        )}
      </motion.div>

      {/* 1. Modal Edit Seluruh Data */}
      <AnimatePresence>
        {editingAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-[90%] max-w-2xl overflow-hidden rounded-[28px] sm:rounded-[32px] p-5 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[85vh]"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

              {/* Icon */}
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-5 relative z-10 backdrop-blur-sm">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Pencil className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
              </div>
              
              <button 
                type="button"
                onClick={() => setEditingAccount(null)}
                className="absolute top-6 right-6 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 sm:mb-8 font-display">
                  Edit Akun <span className="text-blue-200 text-lg ml-2">{editingAccount.id}</span>
                </h3>

              <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Spesifikasi Akun</label>
                    <input 
                      type="text" 
                      {...registerEdit('spec', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Rank / Level</label>
                    <select 
                      {...registerEdit('rank', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner cursor-pointer" 
                    >
                      <option value="">-- Pilih Rank --</option>
                      <option value="IMORTAL">IMORTAL</option>
                      <option value="MYTHIC GLORY">MYTHIC GLORY</option>
                      <option value="MYTHIC HONOR">MYTHIC HONOR</option>
                      <option value="MYTHIC">MYTHIC</option>
                      <option value="LEGEND">LEGEND</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Harga Beli (IDR)</label>
                    <input 
                      type="number" 
                      {...registerEdit('hargaBeli', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-bold text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Harga Jual (IDR)</label>
                    <input 
                      type="number" 
                      {...registerEdit('hargaJual', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-bold text-blue-200 text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Target Jual (IDR)</label>
                    <input 
                      type="number" 
                      {...registerEdit('targetJual')}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-bold text-blue-200 text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Nama Penjual (Seller)</label>
                    <input 
                      type="text" 
                      {...registerEdit('namaPenjual', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Nama Pembeli (Buyer)</label>
                    <input 
                      type="text" 
                      {...registerEdit('pembeli')}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Tanggal Jual (Jika Terjual)</label>
                    <input 
                      type="text" 
                      {...registerEdit('tanggalJual')}
                      placeholder="Contoh: 12/06/2026 atau YYYY-MM-DD"
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Email / Akun Login</label>
                    <input 
                      type="text" 
                      {...registerEdit('email', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Password Akun</label>
                    <input 
                      type="text" 
                      {...registerEdit('password')}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Login Via</label>
                    <select 
                      {...registerEdit('loginVia')}
                      className="w-full bg-blue-900/40 border border-blue-400/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner cursor-pointer"
                    >
                      <option value="">-- Pilih Login --</option>
                      <option value="Google">Google</option>
                      <option value="Bind 0">Bind 0</option>
                      <option value="Rebind">Rebind</option>
                      <option value="Moonton">Moonton</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Status</label>
                    <select 
                      {...registerEdit('status', { required: true })}
                      className="w-full bg-blue-900/40 border border-blue-400/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner cursor-pointer"
                    >
                      <option value="Ready">Ready</option>
                      <option value="Terjual">Terjual</option>
                      <option value="Cicilan">Cicilan</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Merk HP / Device</label>
                    <input 
                      type="text" 
                      list="device-options-edit"
                      {...registerEdit('device', { required: true })}
                      placeholder="Pilih atau ketik sendiri..." 
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                    <datalist id="device-options-edit">
                      <option value="INFINIX HOT 60" />
                      <option value="REDMI NOTE 14" />
                      <option value="REALME NARZO" />
                      <option value="IPHONE 13" />
                      <option value="IPHONE 15" />
                      <option value="REDMI 13" />
                      <option value="REDMI 10 2022" />
                      <option value="TABLET" />
                      <option value="LAPTOP" />
                    </datalist>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Catatan</label>
                    <select 
                      {...registerEdit('catatan')}
                      className="w-full bg-blue-900/40 border border-blue-400/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner cursor-pointer" 
                    >
                      <option value="">- Kosong -</option>
                      <option value="ALLKOS">ALLKOS</option>
                      <option value="( - ) PLAT">( - ) PLAT</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setEditingAccount(null)}
                    className="px-6 py-3 rounded-xl bg-blue-800/40 hover:bg-blue-800/60 text-sm font-bold text-white transition-all active:scale-95 border border-blue-400/30 backdrop-blur-sm"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-sm font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Modal Edit Tanggal (Calendar) */}
      <AnimatePresence>
        {calendarEditingAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-[88%] max-w-[320px] sm:max-w-sm overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

              {/* Icon */}
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-4 sm:mb-5 relative z-10 backdrop-blur-sm">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-5 sm:mb-6 font-display">
                  Ubah Tanggal Masuk
                </h3>

                <form onSubmit={handleCalendarSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider ml-1">Tanggal Masuk</label>
                    <input 
                      type="date" 
                      name="tanggalMasuk"
                      defaultValue={calendarEditingAccount.tanggalMasuk || ''}
                      className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider ml-1">Bulan Masuk</label>
                    <div className="relative">
                      <select 
                        name="bulanMasuk"
                        defaultValue={calendarEditingAccount.bulanMasuk}
                        className="w-full bg-blue-900/40 border border-blue-400/40 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner appearance-none cursor-pointer"
                      >
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                          <option key={m} value={m} className="bg-slate-800 text-white">{m}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex gap-3 mt-7 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setCalendarEditingAccount(null)}
                      className="flex-1 rounded-xl bg-blue-800/40 hover:bg-blue-800/60 py-3.5 text-sm font-bold text-white transition-all active:scale-95 border border-blue-400/30 backdrop-blur-sm"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 rounded-xl bg-white hover:bg-blue-50 py-3.5 text-sm font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Simpan
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Modal Bayar Cicilan */}
      <PaymentModal
        isOpen={!!paymentModalAccount}
        onClose={() => setPaymentModalAccount(null)}
        account={paymentModalAccount}
        onSubmit={(accountId, jumlah, tanggal) => {
          tambahCicilan(accountId, jumlah, tanggal);
        }}
      />

      {/* 4. Modal Confirm Cicilan */}
      <CicilanPromptModal
        isOpen={!!cicilanPromptAccount}
        onClose={() => setCicilanPromptAccount(null)}
        account={cicilanPromptAccount}
        onSubmit={(accountId, buyerName) => {
          if (cicilanPromptAccount) {
            if (buyerName) {
              editAccount({ ...cicilanPromptAccount, status: 'Cicilan', pembeli: buyerName });
            } else {
              updateAccountStatus(accountId, 'Cicilan');
            }
          }
        }}
      />

      {/* 5. Modal Confirm Delete */}
      <DeleteConfirmModal
        isOpen={!!deletePromptAccount}
        onClose={() => setDeletePromptAccount(null)}
        account={deletePromptAccount}
        onConfirm={(accountId) => {
          removeAccount(accountId);
        }}
      />

      {/* 6. Modal Confirm Sell */}
      <SellConfirmModal
        isOpen={!!sellPromptAccount}
        onClose={() => setSellPromptAccount(null)}
        account={sellPromptAccount}
        onSubmit={(accountId, buyerName, hargaJual, tanggalJual) => {
          if (sellPromptAccount) {
            editAccount({
              ...sellPromptAccount,
              pembeli: buyerName,
              hargaJual: hargaJual,
              tanggalJual: tanggalJual,
              status: 'Terjual'
            });
          }
        }}
      />

      {/* 7. Modal Confirm Lunas */}
      <LunasConfirmModal
        isOpen={!!lunasPromptAccount}
        onClose={() => setLunasPromptAccount(null)}
        account={lunasPromptAccount}
        onSubmit={(accountId, hargaJual, tanggalLunas) => {
          if (lunasPromptAccount) {
            editAccount({
              ...lunasPromptAccount,
              hargaJual: hargaJual,
              tanggalJual: tanggalLunas,
              status: 'Terjual',
              totalDibayar: hargaJual
            });
          }
        }}
      />
    </PageMotionWrapper>
  );
};

export default StokML;
