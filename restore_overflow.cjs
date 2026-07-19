const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Restore user's fix for Tambah Akun and Table containers
  const target1 = 'className="spotlight-effect relative overflow-hidden group';
  const replacement1 = 'className="spotlight-effect relative group';
  if (content.includes(target1)) {
    content = content.replace(new RegExp(target1, 'g'), replacement1);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Restored table overflow fix in ' + file);
  }
}

processFile('src/pages/StokFF.tsx');
processFile('src/pages/StokML.tsx');
