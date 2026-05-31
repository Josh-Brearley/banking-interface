// One-off: trim transparent padding around the icon logo so it fills its box.
// Decodes RGBA PNG, finds the alpha bounding box, crops to a centered square
// (with a small margin), and re-encodes. No external deps.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const SRC = new URL("../public/logos/logo-icon.png", import.meta.url);

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function readChunks(buf) {
  let off = 8;
  const chunks = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    chunks.push({ type, data });
    off += 12 + len;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a),
    pb = Math.abs(p - b),
    pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

const png = readFileSync(SRC);
const chunks = readChunks(png);
const ihdr = chunks.find((c) => c.type === "IHDR").data;
const width = ihdr.readUInt32BE(0);
const height = ihdr.readUInt32BE(4);
const colorType = ihdr[9];
if (colorType !== 6) throw new Error(`Expected RGBA (6), got ${colorType}`);

const idat = Buffer.concat(
  chunks.filter((c) => c.type === "IDAT").map((c) => c.data),
);
const raw = inflateSync(idat);
const bpp = 4;
const stride = width * bpp;

// Unfilter into a flat RGBA buffer.
const pixels = Buffer.alloc(height * stride);
for (let y = 0; y < height; y++) {
  const filter = raw[y * (stride + 1)];
  const inRow = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
  const out = pixels.subarray(y * stride, y * stride + stride);
  const prev = y > 0 ? pixels.subarray((y - 1) * stride, (y - 1) * stride + stride) : null;
  for (let x = 0; x < stride; x++) {
    const a = x >= bpp ? out[x - bpp] : 0;
    const b = prev ? prev[x] : 0;
    const c = prev && x >= bpp ? prev[x - bpp] : 0;
    let v = inRow[x];
    if (filter === 1) v += a;
    else if (filter === 2) v += b;
    else if (filter === 3) v += (a + b) >> 1;
    else if (filter === 4) v += paeth(a, b, c);
    out[x] = v & 0xff;
  }
}

// Alpha bounding box.
let minX = width,
  minY = height,
  maxX = -1,
  maxY = -1;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (pixels[y * stride + x * bpp + 3] > 16) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const bw = maxX - minX + 1;
const bh = maxY - minY + 1;
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
// Square crop with ~8% margin, clamped to image bounds.
let side = Math.ceil(Math.max(bw, bh) * 1.16);
side = Math.min(side, width, height);
let sx = Math.round(cx - side / 2);
let sy = Math.round(cy - side / 2);
sx = Math.max(0, Math.min(sx, width - side));
sy = Math.max(0, Math.min(sy, height - side));

console.log(`bbox ${bw}x${bh} at (${minX},${minY}) -> crop ${side}x${side} at (${sx},${sy})`);

// Build cropped RGBA + filter-0 scanlines.
const outStride = side * bpp;
const outRaw = Buffer.alloc(side * (outStride + 1));
for (let y = 0; y < side; y++) {
  outRaw[y * (outStride + 1)] = 0; // filter: none
  pixels.copy(
    outRaw,
    y * (outStride + 1) + 1,
    (sy + y) * stride + sx * bpp,
    (sy + y) * stride + sx * bpp + outStride,
  );
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const newIhdr = Buffer.alloc(13);
newIhdr.writeUInt32BE(side, 0);
newIhdr.writeUInt32BE(side, 4);
newIhdr[8] = 8; // bit depth
newIhdr[9] = 6; // RGBA
const out = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", newIhdr),
  chunk("IDAT", deflateSync(outRaw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(SRC, out);
console.log(`Wrote ${out.length} bytes (${side}x${side}).`);
