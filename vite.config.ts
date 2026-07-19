import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.jpg'],
      manifest: {
        name: "Farid Account Management",
        short_name: "Farid Account",
        description: "Platform Manajemen Akun Game Premium",
        theme_color: "#3b82f6",
        background_color: "#020617",
        display: "standalone",
        icons: [
          {
            src: "/logo.jpg",
            sizes: "192x192 512x512",
            type: "image/jpeg",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
})
