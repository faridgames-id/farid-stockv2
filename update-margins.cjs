const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  // First, let's make sure KalenderKeuangan is updated to the new larger sizes
  if (file === 'KalenderKeuangan.tsx') {
    updated = updated.replace('className="shrink-0 w-11 h-11', 'className="shrink-0 w-12 h-12'); // In case it wasn't updated
    updated = updated.replace(/className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-\[#0f172a\] shadow-\[4px_4px_10px_rgba\(0,0,0,0\.5\),-4px_-4px_10px_rgba\(255,255,255,0\.03\),inset_1px_1px_2px_rgba\(255,255,255,0\.05\)\] border border-slate-800 relative group"/, 'className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-slate-800 relative group"');
    
    updated = updated.replace(/w-6 h-6/, 'w-6 h-6'); // ensure icon is 6
    updated = updated.replace(/w-5 h-5 text-blue-500 drop-shadow/, 'w-6 h-6 text-blue-500 drop-shadow'); 
    
    updated = updated.replace(/text-lg font-display font-bold/g, 'text-xl font-display font-bold');
    updated = updated.replace(/text-slate-500 text-xs -mt-2\.5 font-sans/g, 'text-slate-500 text-sm font-sans');
  }

  // Now, let's fix the margins for ALL files to be -mt-2.5 or -mt-3
  // Find paragraphs that are immediately following the h2 in that flex container
  // We can just replace the negative margin on the subtitle.
  
  // Replace "-mt-1.5" or "-mt-1" or "-mt-2" with "-mt-2.5" on the subtitle texts
  // Typical: <p className="text-slate-400 text-sm -mt-1.5">
  updated = updated.replace(/<p className="([^"]*text-s(?:m|late-[0-9]+)[^"]*)(-mt-\d(?:\.\d)?)([^"]*)">/g, (match, p1, p2, p3) => {
    // If it's the subtitle (usually has text-sm and text-slate-400/500), set it to -mt-2.5
    // But we should only target the specific header ones. 
    // They are all inside <div className="flex flex-col justify-center">
    return `<p className="${p1}-mt-2.5${p3}">`;
  });
  
  // Just in case it doesn't have a margin class yet but needs one
  updated = updated.replace(/<p className="text-slate-500 text-sm font-sans">/g, '<p className="text-slate-500 text-sm -mt-2.5 font-sans">');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated ${file}`);
  }
}
