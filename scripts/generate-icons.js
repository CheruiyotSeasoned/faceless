/**
 * Generates icon-192.png and icon-512.png in /public.
 * Run once: node scripts/generate-icons.js
 * Uses only Node built-ins — no extra packages needed.
 */
const fs   = require('fs')
const path = require('path')
const zlib = require('zlib')

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n, 0)
  return b
}

function crc32(buf) {
  const table = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
      t[i] = c
    }
    return t
  })()
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeB = Buffer.from(type, 'ascii')
  const crcB  = uint32BE(crc32(Buffer.concat([typeB, data])))
  return Buffer.concat([uint32BE(data.length), typeB, data, crcB])
}

function makePNG(size) {
  const sig  = Buffer.from([137,80,78,71,13,10,26,10])
  const ihdr = chunk('IHDR', Buffer.concat([
    uint32BE(size), uint32BE(size),
    Buffer.from([8, 2, 0, 0, 0]),  // 8-bit RGB, no interlace
  ]))

  // Build pixel rows: purple bg (#7c3aed = 124,58,237) with centred white play triangle
  const cx = size / 2, cy = size / 2
  const triH = size * 0.32, triW = size * 0.28

  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    row[0] = 0  // filter: None
    for (let x = 0; x < size; x++) {
      // Radial background: dark purple centre → medium purple edge
      const dx = (x - cx) / size, dy = (y - cy) / size
      const dist = Math.sqrt(dx*dx + dy*dy)
      const lerp = Math.min(dist * 1.8, 1)
      const bgR = Math.round(91  + (124 - 91)  * lerp)
      const bgG = Math.round(33  + (58  - 33)  * lerp)
      const bgB = Math.round(182 + (237 - 182) * lerp)

      // Play triangle test (point right)
      const tx = x - (cx - triW * 0.2)
      const ty = y - cy
      const inTri = tx > 0 && tx < triW &&
                    Math.abs(ty) < (triH / 2) * (1 - tx / triW)

      const off = 1 + x * 3
      if (inTri) {
        row[off] = 255; row[off+1] = 255; row[off+2] = 255
      } else {
        row[off] = bgR; row[off+1] = bgG; row[off+2] = bgB
      }
    }
    rows.push(row)
  }

  const raw        = Buffer.concat(rows)
  const compressed = zlib.deflateSync(raw, { level: 9 })
  const idat       = chunk('IDAT', compressed)
  const iend       = chunk('IEND', Buffer.alloc(0))
  return Buffer.concat([sig, ihdr, idat, iend])
}

const outDir = path.join(__dirname, '..', 'public')
fs.mkdirSync(outDir, { recursive: true })

for (const size of [192, 512]) {
  const file = path.join(outDir, `icon-${size}.png`)
  fs.writeFileSync(file, makePNG(size))
  console.log(`✓  ${file}  (${size}×${size})`)
}
