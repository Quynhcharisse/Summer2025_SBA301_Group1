import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tell Vite to load .env files from the parent directory for client-side code
  envDir: '..',
})
