import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { AccountItem } from '../store/useInventoryStore';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountItem | null;
  onConfirm: (accountId: string) => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, account, onConfirm }) => {
  const handleConfirm = () => {
    if (account) {
      onConfirm(account.id);
      onClose();
    }
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
            className="relative w-[88%] max-w-[320px] sm:max-w-sm overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-4 sm:mb-5 relative z-10 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 0.5, repeat: 3, ease: "easeInOut" }}
              >
                <Trash2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-display">
                Hapus Akun
              </h3>
              
              <p className="text-sm text-blue-50/90 mb-8 leading-relaxed">
                Yakin ingin menghapus akun <strong>{account.id}</strong>? Data yang dihapus tidak dapat dikembalikan.
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-blue-800/40 hover:bg-blue-800/60 py-3.5 text-sm font-bold text-white transition-all active:scale-95 border border-blue-400/30 backdrop-blur-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 rounded-xl bg-white hover:bg-red-50 py-3.5 text-sm font-bold text-red-600 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
