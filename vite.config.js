import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' gjør at siden fungerer på GitHub Pages uansett repo-navn
export default defineConfig({
  plugins: [react()],
  base: './',
})
