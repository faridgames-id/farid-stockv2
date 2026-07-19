const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Add imports
  if (!content.includes('import FormSelect')) {
    content = content.replace(/import PageMotionWrapper/, "import FormSelect from '../components/FormSelect';\nimport PageMotionWrapper");
  }
  if (!content.includes('Controller')) {
    content = content.replace(/import \{ useForm \} from 'react-hook-form';/, "import { useForm, Controller } from 'react-hook-form';");
  }

  // 2. Add control to useForm
  content = content.replace(/const \{ register, handleSubmit, reset \} = useForm<AccountItem>\(\);/, "const { register, handleSubmit, reset, control } = useForm<AccountItem>();");
  content = content.replace(/const \{ register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit \} = useForm<AccountItem>\(\);/, "const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, control: controlEdit } = useForm<AccountItem>();");

  // Custom manual replace for Bulan Masuk since it uses map:
  content = content.replace(/<select\s+\{\.\.\.(register|registerEdit)\('bulanMasuk',\s*\{ required: true \}\)\}\s+className="([^"]+)"\s*>\s*<option value="">-- Pilih Bulan --<\/option>\s*\{\['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'\]\.map\(m => \(\s*<option key=\{m\} value=\{m\}>\{m\}<\/option>\s*\)\)\}\s*<\/select>/g, (match, regFn, className) => {
    const isEdit = regFn === 'registerEdit';
    const controlName = isEdit ? 'controlEdit' : 'control';
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const optionsArray = months.map(m => `{ value: "${m}", label: "${m}" }`);
    
    return `<Controller
                name="bulanMasuk"
                control={${controlName}}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      ${optionsArray.join(',\n                      ')}
                    ]}
                    placeholder="-- Pilih Bulan --"
                    buttonClassName="${className}"
                  />
                )}
              />`;
  });

  // 3. Replace <select> blocks
  const selectRegex = /<select\s+\{\.\.\.(register|registerEdit)\('([^']+)'(?:,\s*\{([^}]+)\})?\)\}[^>]*className="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g;
  
  content = content.replace(selectRegex, (match, regFn, fieldName, rules, className, optionsContent) => {
    const isEdit = regFn === 'registerEdit';
    const controlName = isEdit ? 'controlEdit' : 'control';
    
    // Parse options
    const optionsMatch = [...optionsContent.matchAll(/<option(?: key=\{[^}]+\})? value="([^"]*)">([^<]+)<\/option>/g)];
    
    let placeholder = "-- Pilih --";
    const optionsArray = [];
    
    for (const opt of optionsMatch) {
      if (opt[1] === '') {
        placeholder = opt[2];
      } else {
        optionsArray.push(`{ value: "${opt[1]}", label: "${opt[2]}" }`);
      }
    }
    
    const rulesStr = rules ? `rules={{${rules}}}` : '';
    
    return `<Controller
                name="${fieldName}"
                control={${controlName}}
                ${rulesStr}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      ${optionsArray.join(',\n                      ')}
                    ]}
                    placeholder="${placeholder}"
                    buttonClassName="${className}"
                  />
                )}
              />`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${filePath}`);
}

processFile('src/pages/StokML.tsx');
processFile('src/pages/StokFF.tsx');
