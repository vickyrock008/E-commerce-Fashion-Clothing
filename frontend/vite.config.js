import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Your existing shortcut for the 'src' folder. This is great!
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ✨ We are adding the new "call forwarding" feature here.
  server: {
    proxy: {
      // If a request starts with '/api'...
      '/api': {
        // ...forward it to our backend server.
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})

