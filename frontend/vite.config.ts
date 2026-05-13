import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['snipping-scrubber-register.ngrok-free.dev'],
    proxy: {
      '/upload': 'http://localhost:8000',  // forwards /add/new and /add/existing to FastAPI
    }
  }
})


