import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Tag, Plus, Clock, Edit2, Trash2 } from 'lucide-react';
import { useJurnalStore, type JurnalEntry } from '../store/useJurnalStore';
import { useGlobalFilter } from '../hooks/useGlobalFilter';
import PageMotionWrapper, { itemVariants } from '../components/PageMotionWrapper';

const Jurnal: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<JurnalEntry>();
  const { entries, addEntry, removeEntry } = useJurnalStore();
  const { filterJurnal } = useGlobalFilter();
  // Memoized: only recalculates when entries or global filter changes
  const filteredEntries = useMemo(() => filterJurnal(entries), [entries, filterJurnal]);

  const onSubmit = (data: JurnalEntry) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newEntry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      waktuDibuat: timeString
    };
    
    addEntry(newEntry);
    reset();
  };

  return (
    <PageMotionWrapper className="space-y-8 pb-32 lg:pb-12">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <motion.div 
          initial={{ rotateY: 90, opacity: 0 }} 
          animate={{ rotateY: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0 }} 
          className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"
        >
          <BookOpen className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white tracking-tight leading-none">Jurnal Bisnis</h2>
          <p className="text-slate-400 text-sm -mt-2.5">Catatan harian, evaluasi operasional, dan target bisnis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <motion.div variants={itemVariants} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm lg:sticky lg:top-28 spotlight-effect relative overflow-hidden group">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Tambah Catatan Baru
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" /> Tanggal Catatan
                </label>
                <input 
                  type="date" 
                  {...register('tanggal', { required: true })} 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-500" /> Kategori
                </label>
                <select 
                  {...register('kategori', { required: true })} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Evaluasi Harian">Evaluasi Harian</option>
                  <option value="Catatan Umum">Catatan Umum</option>
                  <option value="Target & Rencana">Target & Rencana</option>
                  <option value="Kendala Operasional">Kendala Operasional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" /> Isi Catatan
                </label>
                <textarea 
                  {...register('catatan', { required: true })} 
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  placeholder="Tuliskan evaluasi atau ide bisnis Anda hari ini..." 
                />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-blue-400/20 transition-colors mt-2"
              >
                Simpan Jurnal
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm min-h-[500px] spotlight-effect relative overflow-hidden group">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Timeline Jurnal Bisnis
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
                  <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-400 text-sm">Belum ada catatan jurnal yang sesuai dengan filter.</p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <motion.div 
                    variants={itemVariants}
                    key={entry.id} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Timeline dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-blue-500 text-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Content Box */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors shadow-sm spotlight-effect">
                      {/* Arrow */}
                      <div className="absolute top-5 -left-3 w-3 h-3 bg-slate-800/50 border-t border-l border-slate-700 rotate-[-45deg] md:group-odd:left-auto md:group-odd:-right-3 md:group-odd:border-t-0 md:group-odd:border-l-0 md:group-odd:border-b md:group-odd:border-r"></div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          entry.kategori === 'Evaluasi Harian' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          entry.kategori === 'Target & Rencana' ? 'bg-blue-950/40 text-blue-300 border-blue-900/30' :
                          entry.kategori === 'Kendala Operasional' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {entry.kategori}
                        </span>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-slate-400 hover:text-blue-400" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            className="text-slate-400 hover:text-blue-300" 
                            title="Hapus"
                            onClick={() => removeEntry(entry.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-slate-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                        {entry.catatan}
                      </p>
                      
                      <div className="flex items-center text-xs text-slate-500 gap-3 border-t border-slate-700/50 pt-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(entry.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {entry.waktuDibuat}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
        
      </div>
    </PageMotionWrapper>
  );
};

export default Jurnal;
