import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const dir = 'web/dist';
const files = await readdir(dir, { recursive: true });
let js = 0,
  total = 0,
  audio = 0;
for (const name of files) {
  if (!(await stat(`${dir}/${name}`)).isFile()) continue;
  const data = await readFile(`${dir}/${name}`);
  if (name.endsWith('.js')) js += gzipSync(data).length;
  if (name.startsWith('audio/') && name.endsWith('.mp3')) audio += data.length;
  if (/\.(js|css)$/.test(name)) total += gzipSync(data).length;
  else if (name.endsWith('.woff2')) total += (await stat(`${dir}/${name}`)).size;
}
console.log(
  `All JS chunks: ${(js / 1024).toFixed(1)} KiB gzip; JS + CSS + WOFF2: ${(total / 1024).toFixed(1)} KiB; Foley: ${(audio / 1024).toFixed(1)} KiB`,
);
if (js > 170 * 1024 || total > 350 * 1024 || audio > 350 * 1024) process.exit(1);
