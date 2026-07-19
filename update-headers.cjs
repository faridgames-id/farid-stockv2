const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = content;

  // Update Icon Container
  updated = updated.replace(/className="shrink-0 w-11 h-11 flex items-center/g, 'className="shrink-0 w-12 h-12 flex items-center');
  
  // Update Icon Size (might be tricky if there are multiple w-5 h-5, but let's target the one right before drop-shadow for the specific icon)
  // Or we can use a more specific regex:
  updated = updated.replace(/w-5 h-5 (text-[a-z]+-500 drop-shadow-\[0_0_10px_rgba)/g, 'w-6 h-6 $1');

  // Update Title
  updated = updated.replace(/<h2 className="text-lg font-bold text-white tracking-tight leading-none">/g, '<h2 className="text-xl font-bold text-white tracking-tight leading-none">');

  // Update Subtitle
  updated = updated.replace(/<p className="text-slate-400 text-xs -mt-2\.5">/g, '<p className="text-slate-400 text-sm -mt-1.5">');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated ${file}`);
  }
}
