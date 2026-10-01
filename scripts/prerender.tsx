import React from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import App from '../web/src/App';
// Ship the actual welcome scene as HTML; React hydrates it for interaction.
const file = new URL('../web/dist/index.html', import.meta.url);
let html = await readFile(file, 'utf8');
// The shared stylesheet is small; inline it to avoid a blocking request on mobile.
const headlineFont = await readFile(
  new URL('../web/public/fonts/bangers-latin.woff2', import.meta.url),
);
for (const match of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)) {
  const css = (await readFile(new URL(`../web/dist${match[1]}`, import.meta.url), 'utf8')).replace(
    /url\(['"]?\/fonts\/bangers-latin\.woff2['"]?\)/,
    `url(data:font/woff2;base64,${headlineFont.toString('base64')})`,
  );
  html = html.replace(match[0], `<style>${css}</style>`);
}
await writeFile(
  file,
  html.replace('<div id="root"></div>', `<div id="root">${renderToString(<App />)}</div>`),
);
console.log('Prerendered welcome scene.');
