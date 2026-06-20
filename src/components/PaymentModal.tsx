import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AlertCard } from './ui/alert-card';
import type { AccountItem } from '../store/useInventoryStore';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountItem | null;
  onSubmit: (accountId: string, jumlah: number, tanggal: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, account, onSubmit }) => {
  const [jumlah, setJumlah] = useState<string>('');
  const [tanggal, setTanggal] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setJumlah('');
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
      setTanggal(formattedDate);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const numericAmount = parseInt(jumlah.replace(/\D/g, ''), 10);
    if (!numericAmount || numericAmount <= 0) {
      toast.custom((t) => (
        <AlertCard
          isVisible={true}
          type="error"
          title="Input Tidak Valid"
          description="Masukkan jumlah pembayaran yang valid!"
          onDismiss={() => toast.dismiss(t)}
        />
      ));
      return;
    }

    if (!tanggal) {
      toast.custom((t) => (
        <AlertCard
          isVisible={true}
          type="error"
          title="Input Tidak Valid"
          description="Masukkan tanggal pembayaran!"
          onDismiss={() => toast.dismiss(t)}
        />
      ));
      return;
    }

    onSubmit(account.id, numericAmount, tanggal);
    onClose();
  };

  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return 'Rp ' + parseInt(numericValue, 10).toLocaleString('id-ID');
  };

  return (
    <AnimatePresence>
      {isOpen && account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl p-7 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-5 relative z-10 backdrop-blur-sm">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <DollarSign className="h-7 w-7 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2 font-display">
                Bayar Cicilan
              </h3>
              
              <div className="mb-6 p-3 bg-blue-900/30 rounded-xl border border-blue-400/20 backdrop-blur-sm">
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">ID Akun</p>
                <p className="text-sm font-bold text-white">{account.id} <span className="text-blue-200 font-medium ml-1">({account.device})</span></p>
              </div>

              <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Amount */}
                <div>
                  <input
                    type="text"
                    value={jumlah}
                    onChange={(e) => setJumlah(formatRupiah(e.target.value))}
                    className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner"
                    placeholder="Jumlah Pembayaran (Rp)"
                    required
                    autoFocus
                  />
                </div>

                {/* Date */}
                <div className="relative">
                  <input
                    type="text"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full pl-4 pr-10 py-3.5 bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner"
                    placeholder="DD/MM/YYYY"
                    required
                  />
                  <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-7">
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

export default PaymentModal;
