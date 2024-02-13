import type { CloudflareResponseBody } from 'vite-plugin-cloudflare-functions/worker';

import 'vite-plugin-cloudflare-functions/client';

declare module 'vite-plugin-cloudflare-functions/client' {
  interface PagesResponseBody {
    '/api/upload': {
      POST: CloudflareResponseBody<typeof import('src/functions/api/upload')['onRequestPost']>;
    };
    '/api/upload_url': {
      GET: CloudflareResponseBody<typeof import('src/functions/api/upload_url')['onRequestGet']>;
    };
    '/api/uploads': {
      GET: CloudflareResponseBody<typeof import('src/functions/api/uploads')['onRequestGet']>;
    };
  }
}
