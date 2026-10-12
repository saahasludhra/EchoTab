// Generates EchoTab extension icons as PNG files using the canvas API in Node.
// Run: node scripts/gen-icons.mjs  (requires no deps — uses pureimage-free approach)
// Simpler: we emit minimal valid PNGs via a hand-rolled encoder is overkill,
// so we create an SVG and convert with sharp if available, else write a
// base64-embedded PNG set generated from an HTML canvas snapshot offline.
//
// In this environment we instead write small valid PNG files directly using
// a minimal PNG encoder (zlib + manual chunks) so no native deps are needed.

import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(size, bg, fg) {
  // RGBA image: gradient-ish rounded square with a centered "echo" dot
  const w = size, h = size;
  const raw = Buffer.alloc(h * (1 + w * 4)); // each row prefixed with filter byte 0
  const r = Math.round(size * 0.22);
  const cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;
    for (let x = 0; x < w; x++) {
      const o = y * (1 + w * 4) + 1 + x * 4;
      // rounded rect mask
      const dx = Math.max(Math.abs(x - cx) - (w / 2 - r), 0);
      const dy = Math.max(Math.abs(y - cy) - (h / 2 - r), 0);
      const inside = Math.hypot(dx, dy) <= r;
      if (!inside) {
        raw[o] = 0; raw[o + 1] = 0; raw[o + 2] = 0; raw[o + 3] = 0;
        continue;
      }
      // diagonal gradient from primary to accent
      const t = (x + y) / (w + h);
      const rr = Math.round(bg[0] * (1 - t) + fg[0] * t);
      const gg = Math.round(bg[1] * (1 - t) + fg[1] * t);
      const bb = Math.round(bg[2] * (1 - t) + fg[2] * t);
      // draw a small echo wave (3 arcs) in white-ish around center
      const dist = Math.hypot(x - cx, y - cy);
      let alpha = 255;
      const wave = Math.sin(dist * 0.55 - size * 0.5);
      if (dist < size * 0.26 && wave > 0.6) {
        raw[o] = 255; raw[o + 1] = 255; raw[o + 2] = 255; raw[o + 3] = 220;
      } else if (dist < size * 0.06) {
        raw[o] = 255; raw[o + 1] = 255; raw[o + 2] = 255; raw[o + 3] = 255;
      } else {
        raw[o] = rr; raw[o + 1] = gg; raw[o + 2] = bb; raw[o + 3] = alpha;
      }
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const out = path.resolve('extension/icons');
fs.mkdirSync(out, { recursive: true });
const primary = [37, 99, 235]; // #2563eb
const accent = [6, 182, 212]; // #06b6d4
for (const size of [16, 32, 48, 128]) {
  const png = makePng(size, primary, accent);
  fs.writeFileSync(path.join(out, `icon-${size}.png`), png);
  console.log(`wrote icon-${size}.png (${png.length} bytes)`);
}
