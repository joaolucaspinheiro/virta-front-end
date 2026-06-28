import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Respeita a porta atribuída pelo ambiente; padrão 5173 no uso normal.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    proxy: {
      // Encaminha as chamadas de autenticação para o backend Spring.
      '/auth': 'http://localhost:8080',
    },
  },
})