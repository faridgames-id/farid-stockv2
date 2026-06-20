const fs = require('fs');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Ensure highlightAccountId is extracted from useAppStore
    if (!content.includes('highlightAccountId')) {
        content = content.replace(
            /const { globalSearch, setGlobalSearch } = useAppStore\(\);/,
            'const { globalSearch, setGlobalSearch, highlightAccountId, setHighlightAccountId } = useAppStore();'
        );
    }

    // 2. Add useEffect to change activeTab based on highlightAccountId
    const effectCode = `
  // Auto-switch tab if navigated from other page with highlight
  React.useEffect(() => {
    if (highlightAccountId) {
      const targetAcc = accounts.find(a => a.id === highlightAccountId);
      if (targetAcc) {
        setActiveTab(targetAcc.status);
      }
      // Optional: clear the highlight ID after a short delay so it doesn't persist forever
      const timer = setTimeout(() => {
        setHighlightAccountId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightAccountId, accounts, setHighlightAccountId]);
`;

    if (!content.includes('Auto-switch tab if navigated')) {
        const insertPoint = content.indexOf('const filteredAccounts =');
        if (insertPoint !== -1) {
            content = content.substring(0, insertPoint) + effectCode + '\n  ' + content.substring(insertPoint);
        }
    }

    // 3. Highlight the specific row in the table
    if (!content.includes('bg-blue-900/30 ring-1 ring-blue-500/50')) {
        content = content.replace(
            /<tr key=\{acc\.id\}/g,
            '<tr key={acc.id}\n                      className={highlightAccountId === acc.id ? "bg-blue-900/30 ring-1 ring-blue-500/50 transition-all duration-500" : ""}'
        );
    }

    fs.writeFileSync(filePath, content);
    console.log('Processed ' + filePath);
}

processFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\StokFF.tsx');
processFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\StokML.tsx');
