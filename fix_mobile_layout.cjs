const fs = require('fs');

function fixMobileLayout(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace the wrapper div to make it full width on mobile
  content = content.replace(
    '<div className="flex flex-col sm:flex-row gap-3">',
    '<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">'
  );

  // 2. Replace the input container to be full width
  content = content.replace(
    '<div className="relative">',
    '<div className="relative w-full sm:w-auto">'
  );

  // 3. Replace the input width from w-64 to w-full sm:w-64
  content = content.replace(
    'className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-64"',
    'className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-64"'
  );

  // 4. Replace the tabs container to use grid on mobile so it stretches evenly
  content = content.replace(
    '<div className="flex gap-2 p-1 bg-slate-800 rounded-lg border border-slate-700 relative">',
    '<div className="grid grid-cols-3 sm:flex gap-2 p-1 bg-slate-800 rounded-lg border border-slate-700 relative w-full sm:w-auto">'
  );

  // 5. Ensure the buttons take full width of their grid cells
  // We'll replace the button className. Note there is a dynamic part.
  const oldBtnClass = 'className={`relative z-10 px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${';
  const newBtnClass = 'className={`relative z-10 w-full sm:w-auto px-4 py-1.5 rounded-md text-sm font-bold transition-colors text-center ${';
  
  if (content.includes(oldBtnClass)) {
      content = content.replace(new RegExp(oldBtnClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newBtnClass);
  } else {
      console.log('Button class not found in ' + file);
  }

  fs.writeFileSync(file, content);
  console.log('Fixed mobile layout in ' + file);
}

fixMobileLayout('src/pages/StokFF.tsx');
fixMobileLayout('src/pages/StokML.tsx');
