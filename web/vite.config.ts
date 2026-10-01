import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
 root: fileURLToPath(new URL('.', import.meta.url)), plugins:[react(), {
  name: 'absolute-social-preview',
  transformIndexHtml(html) {
   const host = process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
   if (!host) return html;
   const origin = new URL(host.startsWith('http') ? host : `https://${host}`).origin;
   return html.replace('content="/og.png"', `content="${origin}/og.png"`);
  },
 }],
 server:{port:5178, strictPort:true, proxy:{'/api':'http://127.0.0.1:8787'}},
 build:{outDir:'dist', target:'es2022', cssCodeSplit:true, sourcemap:false},
});
