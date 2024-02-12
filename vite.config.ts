import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    CloudflarePagesFunctions({
      root: './src/functions',
      dts: './worker-configuration.d.ts',
      wrangler: {
        kv: [
          'KV'
        ],
        d1: [
          'DB'
        ]
      }
    })
  ],
})
