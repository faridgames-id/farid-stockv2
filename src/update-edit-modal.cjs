const fs = require('fs');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const modalStart = content.indexOf('{editingAccount && (');
    if (modalStart === -1) {
        console.log('modalStart not found in ' + filePath);
        return;
    }
    const formStart = content.indexOf('<form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-6">', modalStart);
    const formEnd = content.indexOf('</form>', formStart) + '</form>'.length;
    
    // We replace from modalStart to formStart, and then from formStart to formEnd, then from formEnd to the end of the motion.div
    const motionDivEnd = content.indexOf('</motion.div>', formEnd) + '</motion.div>'.length;
    
    let modalBlock = content.substring(modalStart, motionDivEnd);
    let newBlock = modalBlock;

    // 1. Container replacement
    newBlock = newBlock.replace(
      'className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"',
      'initial={{ opacity: 0, scale: 0.95, y: 10 }}\n              animate={{ opacity: 1, scale: 1, y: 0 }}\n              exit={{ opacity: 0, scale: 0.95, y: 10 }}\n              transition={{ type: "spring", stiffness: 400, damping: 25 }}\n              className="relative w-full max-w-3xl overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[90vh]"'
    );
    // Remove the original initial/animate/exit
    newBlock = newBlock.replace(
      'initial={{ opacity: 0, scale: 0.95 }}\n              animate={{ opacity: 1, scale: 1 }}\n              exit={{ opacity: 0, scale: 0.95 }}\n              initial={{ opacity: 0, scale: 0.95, y: 10 }}',
      'initial={{ opacity: 0, scale: 0.95, y: 10 }}'
    );

    // 2. Button X and Icon Header
    newBlock = newBlock.replace(
      /<button[\s\S]*?<X className="w-5 h-5" \/>[\s\S]*?<\/button>/,
      `{/* Background Accent */}
              <div className="absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-6 relative z-10 backdrop-blur-sm">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Pencil className="h-7 w-7 text-white" />
                </motion.div>
              </div>
              
              <button 
                type="button"
                onClick={() => setEditingAccount(null)}
                className="absolute top-6 right-6 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>`
    );
    
    // 3. Header title
    newBlock = newBlock.replace(
      /<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">[\s\S]*?<\/h3>/,
      `<div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight mb-8 font-display">
                  Edit Akun <span className="text-blue-200 text-lg ml-2">{editingAccount.id}</span>
                </h3>`
    );

    // 4. Wrap form in relative z-10
    newBlock = newBlock.replace(
      /<\/form>\s*<\/motion.div>/,
      '</form>\n              </div>\n            </motion.div>'
    );

    // 5. Replace labels
    newBlock = newBlock.replace(/className="text-xs font-bold text-slate-400 uppercase tracking-wider"/g, 'className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 ml-1"');
    newBlock = newBlock.replace(/<div className="space-y-2">/g, '<div className="space-y-1.5">');

    // 6. Replace inputs
    newBlock = newBlock.replace(/className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2\.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"/g, 'className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner"');
    newBlock = newBlock.replace(/className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2\.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold"/g, 'className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-bold text-sm shadow-inner"');
    newBlock = newBlock.replace(/className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2\.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-blue-400"/g, 'className="w-full bg-blue-900/40 border border-blue-400/40 placeholder-blue-200/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-bold text-blue-200 text-sm shadow-inner"');
    newBlock = newBlock.replace(/className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2\.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"/g, 'className="w-full bg-blue-900/40 border border-blue-400/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-blue-900/60 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all font-medium text-sm shadow-inner cursor-pointer"');

    // 7. Buttons
    newBlock = newBlock.replace(
      'className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"',
      'className="px-6 py-3 rounded-xl bg-blue-800/40 hover:bg-blue-800/60 text-sm font-bold text-white transition-all active:scale-95 border border-blue-400/30 backdrop-blur-sm"'
    );
    newBlock = newBlock.replace(
      'className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"',
      'className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-sm font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"'
    );

    content = content.replace(modalBlock, newBlock);
    fs.writeFileSync(filePath, content);
    console.log('Successfully updated ' + filePath);
}

processFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\StokFF.tsx');
processFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\StokML.tsx');
