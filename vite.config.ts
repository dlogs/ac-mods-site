import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    CloudflarePagesFunctions({
      root: './src/functions',
      wrangler: {
        log: true,
      },
    }),
  ],
})
