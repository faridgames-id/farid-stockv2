const fs = require('fs');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Ensure setGlobalSearch, setCurrentView, setHighlightAccountId are extracted from useAppStore
    if (!content.includes('setHighlightAccountId')) {
        content = content.replace(
            /const { (.*?) } = useAppStore\(\);/,
            'const { $1, setCurrentView, setGlobalSearch, setHighlightAccountId } = useAppStore();'
        );
    }

    // 2. Add onClick to motion.div in the mapping function
    // Find the mapping block
    const mapMatch = content.match(/<motion\.div[\s\S]*?className="bg-slate-800\/40 border border-slate-700\/50 rounded-2xl p-4 flex flex-col gap-2 transition-all duration-300 cursor-default shadow-sm hover:shadow-md"/);
    if (mapMatch) {
        let newDiv = mapMatch[0].replace('cursor-default', 'cursor-pointer hover:border-blue-500/50');
        newDiv = newDiv.replace(
            /key=\{acc\.id\}/,
            `key={acc.id}
                          onClick={() => {
                            setHighlightAccountId(acc.id);
                            setGlobalSearch(acc.id);
                            setCurrentView(acc.game === 'Free Fire' ? 'stok_ff' : 'stok_ml');
                          }}`
        );
        content = content.replace(mapMatch[0], newDiv);
        console.log('Successfully updated motion.div in ' + filePath);
    } else {
        console.log('Mapping block not found in ' + filePath);
    }

    fs.writeFileSync(filePath, content);
    console.log('Processed ' + filePath);
}

processFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\AkunMasuk.tsx');
processFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\KalenderKeuangan.tsx');
