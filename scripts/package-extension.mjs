// Packages the /extension folder into public/EchoTab.zip so the website's
// Download button serves a genuine, loadable Chrome extension.
// Run during build: node scripts/package-extension.mjs

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');

const ROOT = path.resolve('.');
const SRC = path.join(ROOT, 'extension');
const OUT_DIR = path.join(ROOT, 'public');
const OUT = path.join(OUT_DIR, 'EchoTab.zip');

if (!fs.existsSync(SRC)) {
  console.error('[package-extension] extension/ folder not found');
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const out = fs.createWriteStream(OUT);
const archive = new ZipArchive({ zlib: { level: 9 } });

out.on('close', () => {
  console.log(`[package-extension] wrote public/EchoTab.zip (${archive.pointer()} bytes)`);
});

archive.on('warning', (err) => {
  if (err.code !== 'ENOENT') throw err;
});
archive.on('error', (err) => { throw err; });

archive.pipe(out);
// Place everything under EchoTab/ so extraction yields a named folder.
archive.directory(SRC, 'EchoTab');
archive.finalize();
