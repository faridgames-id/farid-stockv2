import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Upload, AlertTriangle } from 'lucide-react';

interface ImportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ImportConfirmModal: React.FC<ImportConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 md:p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl p-7 bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/50 shadow-[8px_8px_20px_rgba(0,0,0,0.6),-8px_-8px_20px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] text-white"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] mb-5 relative z-10 border border-slate-800/80">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Upload className="h-7 w-7 text-blue-300 drop-shadow-[0_0_10px_rgba(147,197,253,0.6)]" />
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
                  className="flex-1 rounded-xl bg-[#0f172a] hover:bg-slate-800 py-3.5 text-sm font-bold text-slate-300 transition-all active:scale-95 shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800"
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
    </AnimatePresence>,
    document.body
  );
};

export default ImportConfirmModal;
