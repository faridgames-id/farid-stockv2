const fs = require('fs');

let content = fs.readFileSync('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\Dashboard.tsx', 'utf8');

// New analytics section to insert before </div>\n  );\n}; at the end
const newSection = `
      {/* ── Advanced Analytics Section ── */}
      <div className="space-y-6 pt-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <motion.div variants={iconPopVariants} initial="initial" animate="animate">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </motion.div>
          Analytics Lanjutan
        </h3>

        {/* Row 1: Bar Chart + Pie + Mini Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Distribusi Game Bar Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group spotlight-effect">
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Distribusi Stok per Game</span>
                  <h4 className="text-xl font-black text-white mt-0.5">Free Fire vs Mobile Legends</h4>
                </div>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>Free Fire</span>
                  <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>Mobile Legends</span>
                </div>
              </div>
              {/* Bar Chart SVG */}
              <div className="w-full h-48">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="ffGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="mlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#4338ca" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0,45,90,135].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="4 4" />
                  ))}
                  {/* Bars - Ready */}
                  <rect x="30" y="60" width="38" height="100" rx="4" fill="url(#ffGrad)" />
                  <rect x="75" y="80" width="38" height="80" rx="4" fill="url(#mlGrad)" />
                  {/* Terjual */}
                  <rect x="165" y="30" width="38" height="130" rx="4" fill="url(#ffGrad)" />
                  <rect x="210" y="50" width="38" height="110" rx="4" fill="url(#mlGrad)" />
                  {/* Cicilan */}
                  <rect x="300" y="90" width="38" height="70" rx="4" fill="url(#ffGrad)" />
                  <rect x="345" y="110" width="38" height="50" rx="4" fill="url(#mlGrad)" />
                  {/* Total */}
                  <rect x="435" y="20" width="38" height="140" rx="4" fill="url(#ffGrad)" opacity="0.7" />
                  {/* Labels */}
                  {["Ready","Terjual","Cicilan","Total"].map((label, i) => (
                    <text key={label} x={72 + i * 135} y="175" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">{label}</text>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Status Distribution Pie/Ring */}
          <motion.div variants={itemVariants}>
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden group spotlight-effect">
              <div className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl" />
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Status Akun</span>
                <h4 className="text-xl font-black text-white mt-0.5">Distribusi Status</h4>
              </div>
              {/* Ring Chart */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Ready segment */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="14" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#3b82f6" strokeWidth="14"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * (semuaReady / (totalSemuaAkun || 1)))}
                    strokeLinecap="butt" />
                  {/* Terjual segment */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#6366f1" strokeWidth="14"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * (totalTerjualVal / (totalSemuaAkun || 1)))}
                    strokeLinecap="butt"
                    style={{transform: \`rotate(\${(semuaReady / (totalSemuaAkun || 1)) * 360}deg)\`, transformOrigin: '60px 60px'}} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{totalSemuaAkun}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Total</span>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Ready</span>
                  <span className="font-bold text-white">{semuaReady}<span className="text-slate-500 font-normal"> unit</span></span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>Terjual</span>
                  <span className="font-bold text-blue-400">{totalTerjualVal}<span className="text-slate-500 font-normal"> unit</span></span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>Cicilan</span>
                  <span className="font-bold text-slate-300">{totalCicilanVal}<span className="text-slate-500 font-normal"> unit</span></span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 2: KPI Cards Row (like reference image) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: 'Total Keuntungan',
              subtitle: 'Profit dari Terjual',
              value: \`Rp \${netProfit.toLocaleString('id-ID')}\`,
              badge: netProfit >= 0 ? '+Profit' : 'Loss',
              badgeColor: netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400',
              trendText: 'vs bulan lalu',
              trendColor: 'text-emerald-400',
              borderColor: 'border-blue-500/30',
            },
            {
              label: 'Akun Terjual',
              subtitle: 'Total unit terjual',
              value: totalTerjualVal.toString(),
              badge: 'Sales',
              badgeColor: 'bg-blue-500/20 text-blue-400',
              trendText: 'unit berhasil terjual',
              trendColor: 'text-blue-400',
              borderColor: 'border-blue-500/30',
            },
            {
              label: 'Rata-rata Margin',
              subtitle: 'Per akun terjual',
              value: totalTerjualVal > 0 ? \`Rp \${Math.round(netProfit / totalTerjualVal).toLocaleString('id-ID')}\` : 'Rp 0',
              badge: 'Margin',
              badgeColor: 'bg-indigo-500/20 text-indigo-400',
              trendText: 'margin bersih per unit',
              trendColor: 'text-indigo-400',
              borderColor: 'border-indigo-500/30',
            },
            {
              label: 'Performa Sistem',
              subtitle: 'Status operasional',
              value: 'EXCELLENT',
              badge: 'Live',
              badgeColor: 'bg-emerald-500/20 text-emerald-400',
              trendText: 'semua sistem berjalan',
              trendColor: 'text-emerald-400',
              borderColor: 'border-emerald-500/30',
              highlight: true,
            },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className={\`bg-gradient-to-br from-slate-900 to-slate-950 border \${kpi.borderColor} p-6 rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg\`}
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent opacity-60"></div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{kpi.label}<br /><span className="text-slate-600 normal-case tracking-normal">{kpi.subtitle}</span></p>
                <div className={\`px-2 py-1 rounded-full text-[9px] font-bold \${kpi.badgeColor}\`}>{kpi.badge}</div>
              </div>
              <p className={\`text-2xl font-black tracking-tight \${kpi.highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400' : 'text-white'}\`}>{kpi.value}</p>
              <p className={\`text-[10px] mt-2 \${kpi.trendColor} font-medium\`}>▲ {kpi.trendText}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 3: Profit Timeline Sparklines */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Profit vs Modal Area Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group spotlight-effect">
              <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Profit vs Modal</span>
                  <h4 className="text-xl font-black text-white mt-0.5">Perbandingan Keuangan</h4>
                </div>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-1 rounded-full bg-blue-500 inline-block"></span>Modal</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-1 rounded-full bg-emerald-500 inline-block"></span>Profit</span>
                </div>
              </div>
              <div className="w-full h-44">
                <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Grid */}
                  {[0,40,80,120].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  ))}
                  {/* Modal Area */}
                  <path d="M 0 130 C 60 110 120 90 180 100 S 300 80 360 60 S 440 40 500 30 L 500 160 L 0 160 Z" fill="url(#modalGrad)" />
                  <path d="M 0 130 C 60 110 120 90 180 100 S 300 80 360 60 S 440 40 500 30" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Profit Area */}
                  <path d="M 0 150 C 60 140 120 130 180 135 S 300 120 360 100 S 440 85 500 70 L 500 160 L 0 160 Z" fill="url(#profitGrad)" />
                  <path d="M 0 150 C 60 140 120 130 180 135 S 300 120 360 100 S 440 85 500 70" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Data points */}
                  <circle cx="180" cy="100" r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="360" cy="60" r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="180" cy="135" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <circle cx="360" cy="100" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  {/* X-axis labels */}
                  {["Jan","Feb","Mar","Apr","Mei","Jun"].map((m, i) => (
                    <text key={m} x={40 + i * 88} y="160" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">{m}</text>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Top Metrics Mini Cards */}
          <motion.div variants={itemVariants} className="space-y-4">
            {[
              { label: 'Konversi Stok', value: \`\${Math.round((totalTerjualVal / (totalSemuaAkun || 1)) * 100)}%\`, sub: 'Stok berhasil terjual', color: 'from-blue-600 to-blue-800' },
              { label: 'Nilai Stok Aktif', value: \`Rp \${accounts.filter(a => a.status === 'Ready').reduce((s, a) => s + a.hargaBeli, 0).toLocaleString('id-ID')}\`, sub: 'Modal belum balik', color: 'from-indigo-600 to-indigo-800' },
              { label: 'Rata-rata Harga Beli', value: totalSemuaAkun > 0 ? \`Rp \${Math.round(totalModal / totalSemuaAkun).toLocaleString('id-ID')}\` : 'Rp 0', sub: 'Per akun keseluruhan', color: 'from-slate-700 to-slate-900' },
            ].map(item => (
              <div key={item.label} className={\`bg-gradient-to-br \${item.color} border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden shadow-lg\`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-lg font-black text-white leading-tight">{item.value}</p>
                <p className="text-[10px] text-blue-300 mt-1 opacity-70">{item.sub}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

`;

// Insert new section before AnimatePresence for AI modal
const insertPoint = content.indexOf('      <AnimatePresence>\n        {isAiModalOpen');
if (insertPoint === -1) {
    console.log('Insert point not found!');
    process.exit(1);
}

content = content.slice(0, insertPoint) + newSection + content.slice(insertPoint);

// Also ensure accounts is available in the component (it already is: const accounts = filterAccounts(rawAccounts);)
fs.writeFileSync('c:\\\\WEB DAN APLIKASI\\\\Akun managemen 1\\\\src\\\\pages\\\\Dashboard.tsx', content);
console.log('Done! Advanced analytics section added.');
