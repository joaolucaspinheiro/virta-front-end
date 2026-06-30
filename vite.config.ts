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
    // Respect the port assigned by the environment; defaults to 5173 normally.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    proxy: {
      // Forward authentication and API calls to the Spring backend.
      '/auth': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
    },
  },
})