const fs = require('fs');

let content = fs.readFileSync('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\Dashboard.tsx', 'utf8');

// 1. Ensure required icons are imported
if (!content.includes('Gamepad2')) {
    content = content.replace(
        /import \{ LayoutGrid, Sparkles, (.*?) \} from 'lucide-react';/,
        "import { LayoutGrid, Sparkles, $1, Gamepad2, CheckCircle, Package, Clock } from 'lucide-react';"
    );
}

// 2. Replace metricCards definition
const metricCardsOld = /const metricCards = \[\s*\{\s*label: 'TOTAL AKUN FF'[\s\S]*?\];/;
const metricCardsNew = `const metricCards = [
    { label: 'Total Akun FF', value: totalAkunFF, subtitle: 'Semua Status', badge: 'Game', icon: Gamepad2, color: 'from-blue-600 to-blue-800' },
    { label: 'FF Ready', value: ffReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'from-blue-800 to-slate-900' },
    { label: 'Total Akun ML', value: totalAkunML, subtitle: 'Semua Status', badge: 'Game', icon: Gamepad2, color: 'from-blue-600 to-blue-800' },
    { label: 'ML Ready', value: mlReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'from-blue-800 to-slate-900' },
    { label: 'Total Semua', value: totalSemuaAkun, subtitle: 'Seluruh Akun', badge: 'All', icon: Package, color: 'from-indigo-600 to-blue-800' },
    { label: 'Semua Ready', value: semuaReady, subtitle: 'Siap Jual', badge: '+Stok', icon: CheckCircle, color: 'from-indigo-800 to-slate-900' },
    { label: 'Terjual', value: totalTerjualVal, subtitle: 'Sukses Terjual', badge: 'Sales', icon: DollarSign, color: 'from-blue-500 to-blue-700' },
    { label: 'Cicilan', value: totalCicilanVal, subtitle: 'Pending Payment', badge: 'Hold', icon: Clock, color: 'from-blue-800 to-slate-900' },
  ];`;
content = content.replace(metricCardsOld, metricCardsNew);

// 3. Replace 8-Grid JSX
const grid8Old = /<motion\.div\s+variants=\{containerVariants\}\s+initial="hidden"\s+animate="show"\s+className="grid grid-cols-2 md:grid-cols-4 gap-4"\s*>\s*\{metricCards\.map\([\s\S]*?<\/motion\.div>\s*\)\)\s*\}\s*<\/motion\.div>/;

const grid8New = `<motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className={\`bg-gradient-to-br \${card.color} border border-blue-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer\`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 shadow-inner flex items-center justify-center backdrop-blur-sm">
                <card.icon className="w-5 h-5 text-blue-100" />
              </div>
              <div className="px-2 py-1 rounded-full bg-blue-400/20 text-blue-200 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                {card.badge}
              </div>
            </div>
            
            <div className="relative z-10">
              <h4 className="text-xs text-blue-200 font-semibold mb-1 uppercase tracking-wider">{card.label}</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white leading-none">{card.value}</span>
              </div>
              <p className="text-[10px] text-blue-300 mt-1.5 opacity-80">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>`;
content = content.replace(grid8Old, grid8New);

// 4. Replace Statistik Keuangan Cards JSX
const finCardsOld = /\{\[\s*\{\s*label:\s*'TOTAL MODAL'[\s\S]*?<\/motion\.div>\s*\)\)\s*\}/;

const finCardsNew = `{[
              { label: 'TOTAL MODAL', value: \`Rp \${totalModal.toLocaleString('id-ID')}\`, subtitle: 'Keseluruhan Modal', badge: 'Capital' },
              { label: 'TOTAL TERJUAL', value: \`Rp \${totalTerjualUang.toLocaleString('id-ID')}\`, subtitle: 'Pemasukan Kotor', badge: 'Revenue' },
              { label: 'PROFIT/LOSS', value: \`\${netProfit >= 0 ? '+' : '-'}\u00A0Rp \${Math.abs(netProfit).toLocaleString('id-ID')}\`, subtitle: 'Keuntungan Bersih', badge: 'Profitabilitas' },
              { label: 'POTENSI PROFIT', value: \`Rp \${potensiProfit.toLocaleString('id-ID')}\`, subtitle: 'Estimasi Masa Depan', badge: 'Forecast' },
            ].map((card) => (
              <motion.div
                key={card.label}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-blue-900/80 to-slate-900 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</h4>
                  <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase">
                    {card.badge}
                  </div>
                </div>
                
                <div>
                  <span className="text-2xl font-black text-white tracking-tight block mb-1.5">{card.value}</span>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> {card.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}`;
content = content.replace(finCardsOld, finCardsNew);

fs.writeFileSync('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\Dashboard.tsx', content);
console.log('Done!');
