import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0', // Tarmoqdagi boshqa qurilmalardan ham kirish uchun
      port: 5173,       // (Ixtiyoriy) Portni o‘zgartirish mumkin
      open: true,       // (Ixtiyoriy) Brauzer avtomatik ochilishi
    },
  }
})