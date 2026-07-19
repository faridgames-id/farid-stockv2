const fs = require('fs');

function fixOverflow(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove overflow-hidden from Tambah Akun and Table containers
  content = content.replace(/className="spotlight-effect relative overflow-hidden group/g, 'className="spotlight-effect relative group');
  
  // Remove overflow-hidden from Edit Modal
  content = content.replace(/className="relative w-full max-w-3xl overflow-hidden/g, 'className="relative w-full max-w-3xl');
  
  // Add pb-48 to the Edit Modal to allow scrolling for the dropdown
  content = content.replace(/max-h-\[90vh\]"/g, 'max-h-[90vh] pb-48"');

  fs.writeFileSync(filePath, content);
  console.log(`Fixed overflow in ${filePath}`);
}

fixOverflow('src/pages/StokML.tsx');
fixOverflow('src/pages/StokFF.tsx');
