const fs = require('fs');
const path = require('path');
const files = [
  path.join(__dirname, 'src/pages/StokML.tsx'), 
  path.join(__dirname, 'src/pages/StokFF.tsx')
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix double copy button in Cicilan section if it exists
  const copyButtonRegex = /(<motion\.button[^>]*onClick={\(\) => handleCopy\(acc\)}[^>]*title="Salin Data Akun"[\s\S]*?<\/motion\.button>\s*)/g;
  
  // Actually, we know exactly what is duplicated.
  // We can just find multiple instances of the copy button occurring right after another in the cicilan block.
  // An easier way: remove all copy buttons from the cicilan block, then add exactly one back.
  // Wait, I can just replace the whole duplicated block by searching for two identical copy buttons.
  const copyBtnText = `<motion.button 
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
                            </motion.button>`;

  // Instead of a complex regex, we can do string replace:
  // We look for two copies of it separated by whitespace
  content = content.replace(new RegExp(copyBtnText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*' + copyBtnText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), copyBtnText);


  // Fix Edit Akun modal styling
  // Old: className="relative w-full max-w-3xl overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[90vh]"
  // New: className="relative w-[92%] sm:w-[90%] md:w-full max-w-2xl overflow-hidden rounded-[32px] p-5 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[85vh]"
  // To make corners crop properly on mobile and look like the others.
  content = content.replace(
    /className="relative w-full max-w-3xl overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400\/30 overflow-y-auto max-h-\[90vh\]"/g,
    'className="relative w-[90%] max-w-2xl overflow-hidden rounded-[28px] sm:rounded-[32px] p-5 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[85vh]"'
  );
  
  // Update Edit Akun title to match
  content = content.replace(
    /<h3 className="text-2xl font-bold tracking-tight mb-8 font-display">\s*Edit Akun/g,
    '<h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 sm:mb-8 font-display">\n                  Edit Akun'
  );
  
  // Also adjust the icon box size to match the smaller modals:
  // Old: className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-6 relative z-10 backdrop-blur-sm"
  content = content.replace(
    /className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white\/20 shadow-inner shadow-white\/30 mb-6 relative z-10 backdrop-blur-sm"/g,
    'className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner shadow-white/30 mb-5 relative z-10 backdrop-blur-sm"'
  );
  
  // Icon inside edit modal
  content = content.replace(
    /<Pencil className="h-7 w-7 text-white" \/>/g,
    '<Pencil className="h-6 w-6 sm:h-7 sm:w-7 text-white" />'
  );

  fs.writeFileSync(file, content);
});
console.log('Done fixing modals and buttons.');
