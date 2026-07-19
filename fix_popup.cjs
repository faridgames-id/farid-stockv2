const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  // the exact string from the file
  const target = 'className="relative w-full max-w-3xl overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[90vh]"';
  const replacement = 'className="relative w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400/30 overflow-y-auto max-h-[90vh] pb-6"';
  
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  } else {
    console.log('Target line not found in ' + file);
  }
}

processFile('src/pages/StokFF.tsx');
processFile('src/pages/StokML.tsx');
