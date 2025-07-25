import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          appwrite: ['appwrite']
        }
      }
    }
  },
  define: {
    'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
