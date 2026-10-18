import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  return {
    base: env.VITE_BASE || '/',
    // Keep Vite's generated index.html entry script relative on GitHub Pages project sites.
    // Dynamic URLs in React continue to use import.meta.env.BASE_URL via assetUrl().
    ...(env.VITE_BASE ? { appType: 'spa' as const } : {}),
    plugins: [react(), tailwindcss()],
  }
})
