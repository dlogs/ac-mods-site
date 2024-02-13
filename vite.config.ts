import { globSync } from 'glob'
import { resolve } from 'path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      makeAbsoluteExternalsRelative: true,
      output: {
        entryFileNames: '[name].js',
      },
      input: {
        ...Object.fromEntries(
          globSync('src/functions/**/*.ts')
            .filter((p) => !p.includes('.d.ts'))
            .map((file) => [
              // This remove `src/` as well as the file extension from each
              // file, so e.g. src/nested/foo.js becomes nested/foo
              path.relative('src', file.slice(0, file.length - path.extname(file).length)),
              // This expands the relative paths to absolute paths, so e.g.
              // src/nested/foo becomes /project/src/nested/foo.js
              fileURLToPath(new URL(file, import.meta.url)),
            ]),
        ),
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [
    react(),
    // CloudflarePagesFunctions({
    //   root: './src/functions',
    //   wrangler: {
    //     log: true,
    //   },
    // }),
  ],
})
