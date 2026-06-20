📄 PRD Update: Ultra-HD Typography & Glassmorphism Polish
Dokumen: Spesifikasi Desain Visual Lanjutan (Micro-Styling)
Fokus Utama: Penyempurnaan Teks Utama (Gradient Text), Penambahan Subtitle Sinematik, dan Tombol Glassmorphism Interaktif.

1. Ringkasan Eksekutif (Executive Summary)
   Setelah latar belakang video (Live Video Background) berhasil diimplementasikan, elemen teks di atasnya harus diseimbangkan agar tidak terlihat murahan atau "kaku". Pembaruan ini bertujuan menggeser gaya teks dasar menjadi gaya desain Premium Tech-Company (seperti Apple atau Vercel) menggunakan teknik Text Gradient Clipping, Glassmorphism, dan Micro-interactions pada ikon.

2. Sistem Tipografi Lanjutan (Typography System)
   Hierarki teks dibagi menjadi tiga lapisan presisi untuk menciptakan efek kedalaman visual (3D/Sinematik) di atas video luar angkasa:

A. The Cinematic Subtitle (Label Atas)
Fungsi: Membangun antisipasi dan mempertegas konteks aplikasi ("Enterprise Account Management").

Gaya Visual: \* Huruf kapital seluruhnya (Uppercase).

Jarak antar huruf (letter-spacing) dibuat sangat ekstrem (tracking-[0.4em]).

Ukuran teks kecil (text-xs hingga text-sm) untuk kontras rasio yang elegan.

Warna Cyan menyala (text-cyan-400) dengan drop-shadow agar teks seperti memancarkan cahaya neon tipis.

B. The Main Title (Judul Utama - "FARID SHOP")
Fungsi: Fokus utama pandangan pengguna (Focal Point).

Gaya Visual:

Ukuran masif (text-6xl md:text-8xl) dan ketebalan maksimal (font-black).

Metallic Gradient Effect: Teks tidak lagi berwarna putih solid, melainkan memiliki tekstur gradasi dari Putih Bersih di atas ke Perak/Abu-abu di bawah (bg-gradient-to-b from-white to-slate-400). Efek ini dicapai menggunakan teknik bg-clip-text text-transparent.

Efek glow putih di sekeliling teks untuk memisahkannya dari gelapnya planet di video latar belakang.

3. Komponen Tombol: Interactive Glassmorphism CTA
   Tombol "GET STARTED" tidak lagi berbentuk kotak/elips padat, melainkan mengadopsi material kaca transparan yang bereaksi terhadap sentuhan.

Material Kaca (Glassmorphism): Menggunakan bg-slate-900/40 dipadukan dengan backdrop-blur-md sehingga warna cincin planet dari video latar belakang akan terlihat membias samar di balik tombol.

Micro-Interactions (Ikon Bergerak): Penambahan ikon panah (->) di sebelah teks. Saat kursor diarahkan ke tombol (hover), panah ini akan meluncur maju beberapa piksel (translate-x-1) memberikan sinyal kuat untuk diklik.

Aura Menyala (Glow Ring): Lapisan bayangan di belakang tombol (absolute -inset-[1px] -z-10) yang pada awalnya tidak terlihat (opacity-0), namun akan memancarkan gradasi biru cerah yang diblur (blur-lg) saat disentuh kursor.

4. Parameter Fisika Animasi (Framer Motion Specs)
   Status Idle: Tombol membesar sedikit saat disorot (whileHover={{ scale: 1.05 }}).

Status Ditekan (Tap): Tombol secara fisik mengecil untuk memberikan umpan balik taktil (whileTap={{ scale: 0.95 }}).
