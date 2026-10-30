import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Ensure public dir exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4A0420" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>
  <!-- Background Rounded Shield -->
  <rect width="512" height="512" rx="128" fill="url(#grad)" />
  
  <!-- Subtle Outer Ring -->
  <circle cx="256" cy="256" r="210" fill="none" stroke="#FBCFE8" stroke-width="4" stroke-opacity="0.25" />

  <!-- Radiant Inner Shield / Heart -->
  <g filter="url(#shadow)">
    <!-- Maternal Heart Shape -->
    <path d="M256 416 C256 416, 96 312, 96 200 C96 140, 144 96, 204 96 C236 96, 256 120, 256 120 C256 120, 276 96, 308 96 C368 96, 416 140, 416 200 C416 312, 256 416, 256 416 Z" 
          fill="#E11D48" />
          
    <!-- Clinical Cross Inside Heart -->
    <rect x="238" y="180" width="36" height="110" rx="10" fill="#FFFFFF" />
    <rect x="201" y="217" width="110" height="36" rx="10" fill="#FFFFFF" />
  </g>

  <!-- Maternal Crescent Halo -->
  <circle cx="256" cy="235" r="92" fill="none" stroke="#FFE4E6" stroke-width="6" stroke-dasharray="14 10" opacity="0.6" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

// Helper to write valid PNG file using pure Node.js
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return (c ^ (-1)) >>> 0;
}

function writePNG(filePath, width, height, renderPixel) {
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel;
  const rawData = Buffer.alloc(height * (scanlineLength + 1));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixel(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filePath, png);
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Brand Colors
const BG_R = 0x88, BG_G = 0x13, BG_B = 0x37; // #881337
const HEART_R = 0xE1, HEART_G = 0x1D, HEART_B = 0x48; // #E11D48
const WHITE_R = 0xFF, WHITE_G = 0xFF, WHITE_B = 0xFF;

// Mathematical Heart distance formula
function inHeart(nx, ny) {
  // Normalize to -1.3 .. 1.3
  const x = (nx - 0.5) * 2.6;
  const y = (0.55 - ny) * 2.6; // inverted y
  // (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
  const term = (x * x + y * y - 0.8);
  return (term * term * term - x * x * y * y * y) <= 0;
}

function inCross(nx, ny) {
  const cx = 0.5, cy = 0.5;
  const dx = Math.abs(nx - cx);
  const dy = Math.abs(ny - cy);
  const armThick = 0.07;
  const armLen = 0.22;
  return (dx < armThick && dy < armLen) || (dy < armThick && dx < armLen);
}

// Generator function
function pixelShader(x, y, w, h, isMaskable) {
  const nx = x / w;
  const ny = y / h;

  // Background
  let r = BG_R, g = BG_G, b = BG_B, a = 255;

  // Corner rounding for regular icons
  if (!isMaskable) {
    const radius = w * 0.22;
    const dx = Math.max(0, Math.max(radius - x, x - (w - radius)));
    const dy = Math.max(0, Math.max(radius - y, y - (h - radius)));
    if (dx * dx + dy * dy > radius * radius) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  // Safe scale for maskable (central 80% circle)
  const scale = isMaskable ? 0.8 : 0.95;
  const snx = (nx - 0.5) / scale + 0.5;
  const sny = (ny - 0.5) / scale + 0.5;

  if (snx >= 0 && snx <= 1 && sny >= 0 && sny <= 1) {
    if (inHeart(snx, sny)) {
      if (inCross(snx, sny)) {
        r = WHITE_R; g = WHITE_G; b = WHITE_B;
      } else {
        r = HEART_R; g = HEART_G; b = HEART_B;
      }
    }
  }

  return [r, g, b, a];
}

// Generate PWA and Apple Touch Icons
writePNG(path.join(publicDir, 'pwa-192x192.png'), 192, 192, (x, y, w, h) => pixelShader(x, y, w, h, false));
writePNG(path.join(publicDir, 'pwa-512x512.png'), 512, 512, (x, y, w, h) => pixelShader(x, y, w, h, false));
writePNG(path.join(publicDir, 'pwa-maskable-512x512.png'), 512, 512, (x, y, w, h) => pixelShader(x, y, w, h, true));
writePNG(path.join(publicDir, 'apple-touch-icon.png'), 180, 180, (x, y, w, h) => pixelShader(x, y, w, h, false));

console.log('PWA icons successfully generated in public/ directory!');
