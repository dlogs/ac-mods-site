// import type { CloudflareResponseBody } from 'vite-plugin-cloudflare-functions/worker'

// import 'vite-plugin-cloudflare-functions/client'

// declare module 'vite-plugin-cloudflare-functions/client' {
//   interface PagesResponseBody {
//     '/api/uploads': {
//       GET: CloudflareResponseBody<(typeof import('./uploads'))['onRequestGet']>
//     }
//     '/api/upload_url': {
//       GET: CloudflareResponseBody<(typeof import('./upload_url'))['onRequestGet']>
//     }
//     '/api/upload': {
//       POST: CloudflareResponseBody<(typeof import('./upload'))['onRequestPost']>
//     }
//   }
// }

// declare module 'vite-plugin-cloudflare-functions/worker' {
interface Env {
  KV: KVNamespace
  DB: D1Database
}

//   interface PagesFunctionData {}
// }
