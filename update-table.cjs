const fs = require('fs');
const path = require('path');
const files = [
  path.join(__dirname, 'src/pages/StokML.tsx'), 
  path.join(__dirname, 'src/pages/StokFF.tsx')
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace button sizes
  content = content.replace(/className=\"w-8 h-8 flex items-center justify-center/g, 'className=\"w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center');
  
  // Add Copy button to Cicilan section.
  const copyButtonStr = `
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
`;

  content = content.replace(
    /acc\.status === 'Cicilan' \? \(\s*<>\s*<motion\.button/g, 
    `acc.status === 'Cicilan' ? (\n                          <>\n${copyButtonStr}\n                            <motion.button`
  );
  
  // Replace icon classes in buttons
  const icons = ['Pencil', 'DollarSign', 'CheckCircle', 'Trash2', 'Copy', 'Calendar', 'CreditCard'];
  icons.forEach(icon => {
    const searchRegExp = new RegExp(`<${icon} className="w-4 h-4" />`, 'g');
    content = content.replace(searchRegExp, `<${icon} className="w-5 h-5 sm:w-4 sm:h-4" />`);
  });
  
  // Besarkan tabel: Let's increase table's text size.
  content = content.replace(/<table className="w-full text-left border-collapse">/g, '<table className="w-full text-left border-collapse text-[14px] sm:text-base">');
  
  fs.writeFileSync(file, content);
});
console.log('Done modifying action buttons and table size.');
