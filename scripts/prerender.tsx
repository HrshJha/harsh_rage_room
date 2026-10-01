import React from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import App from '../web/src/App';
// Ship the actual welcome scene as HTML; React hydrates it for interaction.
const file = new URL('../web/dist/index.html', import.meta.url);
let html = await readFile(file, 'utf8');
// The shared stylesheet is small; inline it to avoid a blocking request on mobile.
const fonts = await Promise.all(
  ['bangers', 'anton'].map(async (name) => ({
    name,
    data: (
      await readFile(new URL(`../web/public/fonts/${name}-latin.woff2`, import.meta.url))
    ).toString('base64'),
  })),
);
for (const match of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)) {
  let css = await readFile(new URL(`../web/dist${match[1]}`, import.meta.url), 'utf8');
  for (const font of fonts)
    css = css.replace(
      new RegExp(`url\\(['"]?/fonts/${font.name}-latin\\.woff2['"]?\\)`),
      `url(data:font/woff2;base64,${font.data})`,
    );
  html = html.replace(match[0], `<style>${css}</style>`);
}
await writeFile(
  file,
  html.replace('<div id="root"></div>', `<div id="root">${renderToString(<App />)}</div>`),
);
console.log('Prerendered welcome scene.');
