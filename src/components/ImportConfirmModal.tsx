import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertTriangle } from 'lucide-react';

interface ImportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ImportConfirmModal: React.FC<ImportConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl p-7 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-blue-500/30"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 shadow-inner shadow-blue-500/30 mb-5 relative z-10 backdrop-blur-sm border border-blue-400/20">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Upload className="h-7 w-7 text-blue-400" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2 font-['Outfit']">
                Import Data
              </h3>
              
              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                Yakin ingin mengimport data? Data yang lama akan hilang dan tertimpa data yang baru.
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-3.5 text-sm font-bold text-white transition-all active:scale-95 border border-slate-600 backdrop-blur-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" /> Yakin
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportConfirmModal;
