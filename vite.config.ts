import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dark-forest/',
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0]),
    __VERSION__: JSON.stringify('0.0.2'),
  },
})
