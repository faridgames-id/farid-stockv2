const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if missing
    if (!content.includes("import { useAppStore }")) {
        content = content.replace(
            "import { useInventoryStore }",
            "import { useAppStore } from '../store/useAppStore';\nimport { useInventoryStore }"
        );
    }

    // Add highlightAccountId extraction
    if (!content.includes("const { highlightAccountId")) {
        content = content.replace(
            "const { filterAccounts } = useGlobalFilter();",
            "const { filterAccounts } = useGlobalFilter();\n  const { highlightAccountId, setHighlightAccountId } = useAppStore();"
        );
    }

    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
}

fixFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\StokFF.tsx');
fixFile('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\StokML.tsx');
