import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '9ba6-2803-9800-9843-69ad-9524-970-3763-3aaf.ngrok-free.app'
    ]
  }
})
