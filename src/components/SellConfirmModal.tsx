import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import type { AccountItem } from '../store/useInventoryStore';

interface SellConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountItem | null;
  onSubmit: (accountId: string, buyerName: string, hargaJual: number, tanggalJual: string) => void;
}

const SellConfirmModal: React.FC<SellConfirmModalProps> = ({ isOpen, onClose, account, onSubmit }) => {
  const [buyerName, setBuyerName] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [tanggalJual, setTanggalJual] = useState('');

  useEffect(() => {
    if (isOpen && account) {
      setBuyerName(account.pembeli || '');
      setHargaJual(account.hargaJual ? account.hargaJual.toString() : '');
      if (account.tanggalJual) {
        setTanggalJual(account.tanggalJual);
      } else {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        setTanggalJual(formattedDate);
      }
    }
  }, [isOpen, account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account) {
      const numericPrice = parseInt(hargaJual.replace(/\D/g, ''), 10) || 0;
      onSubmit(account.id, buyerName.trim(), numericPrice, tanggalJual);
      onClose();
    }
  };

  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return 'Rp ' + parseInt(numericValue, 10).toLocaleString('id-ID');
  };

  return (
    <AnimatePresence>
      {isOpen && account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-[88%] max-w-[320px] sm:max-w-sm overflow-y-auto overflow-x-hidden max-h-[85vh] rounded-3xl p-5 sm:p-7 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-4 sm:mb-5 relative z-10 backdrop-blur-sm">
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-5 sm:mb-6 font-display">
                Jual Akun {account.game === 'Free Fire' ? 'FF' : 'ML'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama Pembeli */}
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Nama Pembeli</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama pembeli"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner"
                    autoFocus
                    required
                  />
                </div>

                {/* Harga Jual */}
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Harga Jual (IDR)</label>
                  <input
                    type="text"
                    value={hargaJual ? formatRupiah(hargaJual) : ''}
                    onChange={(e) => setHargaJual(e.target.value)}
                    className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner"
                    placeholder="Rp 0"
                    required
                  />
                </div>

                {/* Tanggal Jual */}
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">Tanggal Jual</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tanggalJual}
                      onChange={(e) => setTanggalJual(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner"
                      placeholder="DD/MM/YYYY"
                      required
                    />
                    <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-7 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl bg-blue-800/40 hover:bg-blue-800/60 py-3.5 text-sm font-bold text-white transition-all active:scale-95 border border-blue-400/30 backdrop-blur-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-white hover:bg-blue-50 py-3.5 text-sm font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Simpan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SellConfirmModal;
