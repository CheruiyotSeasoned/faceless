/**
 * Generates icon-192.png and icon-512.png — ClipTok AI branded icons.
 * node scripts/generate-icons.js
 */
const fs   = require('fs')
const path = require('path')
const zlib = require('zlib')

// ── PNG plumbing ───────────────────────────────────────────────────────────────

function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n, 0); return b }

function crc32(buf) {
  let t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = (c&1)?(0xedb88320^(c>>>1)):(c>>>1); t[i]=c }
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = t[(c^buf[i])&0xff]^(c>>>8)
  return (c^0xffffffff)>>>0
}

function pngChunk(type, data) {
  const tb = Buffer.from(type,'ascii')
  return Buffer.concat([u32(data.length), tb, data, u32(crc32(Buffer.concat([tb,data])))])
}

// ── Drawing primitives ─────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b-a)*t }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

// Smooth circle mask  (1 inside, 0 outside, soft aa edge)
function circleMask(px, py, cx, cy, r) {
  const d = Math.sqrt((px-cx)**2+(py-cy)**2)
  return clamp(r-d+0.8, 0, 1)
}

// Rounded-rect mask
function rrectMask(px, py, x, y, w, h, rx) {
  const dx = Math.max(0, Math.abs(px - (x+w/2)) - w/2 + rx)
  const dy = Math.max(0, Math.abs(py - (y+h/2)) - h/2 + rx)
  const d  = Math.sqrt(dx*dx+dy*dy) - rx
  return clamp(-d+0.8, 0, 1)
}

function buildIcon(S) {
  const pixels = new Uint8Array(S * S * 3)

  const set = (x, y, r, g, b, alpha=1) => {
    if (x<0||y<0||x>=S||y>=S) return
    const i = (y*S+x)*3
    const a = clamp(alpha,0,1)
    pixels[i]   = Math.round(pixels[i]   * (1-a) + r*a)
    pixels[i+1] = Math.round(pixels[i+1] * (1-a) + g*a)
    pixels[i+2] = Math.round(pixels[i+2] * (1-a) + b*a)
  }

  // ── 1. Background gradient  (deep purple → violet) ────────────────────────
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    const t = (x/S*0.4 + y/S*0.6)
    const r = Math.round(lerp(30, 92, t))   // #1e1b4b → #5b21b6
    const g = Math.round(lerp(27, 33, t))
    const b = Math.round(lerp(75, 182, t))
    set(x, y, r, g, b)
  }

  // ── 2. Radial glow in centre ───────────────────────────────────────────────
  const cx=S/2, cy=S/2
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    const dist = Math.sqrt((x-cx)**2+(y-cy)**2) / (S*0.5)
    const glow = Math.max(0, 1-dist)*0.3
    const i = (y*S+x)*3
    pixels[i]   = clamp(pixels[i]   + 120*glow, 0, 255)
    pixels[i+1] = clamp(pixels[i+1] +  40*glow, 0, 255)
    pixels[i+2] = clamp(pixels[i+2] + 255*glow, 0, 255)
  }

  // ── 3. Frosted-glass card (white 18% opacity, rounded rect) ───────────────
  const cw=S*0.62, ch=S*0.62, cr=S*0.13
  const cx0=cx-cw/2, cy0=cy-ch/2
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    const m = rrectMask(x,y, cx0,cy0, cw,ch, cr)
    if (m>0) set(x,y, 255,255,255, m*0.18)
  }
  // card border highlight
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    const outer = rrectMask(x,y, cx0,cy0, cw,ch, cr)
    const inner = rrectMask(x,y, cx0+1.5,cy0+1.5, cw-3,ch-3, cr-1.5)
    const border = outer - inner
    if (border>0) set(x,y, 255,255,255, border*0.35)
  }

  // ── 4. Play button circle ──────────────────────────────────────────────────
  const pr = S*0.17
  // Circle fill
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    const m = circleMask(x,y, cx,cy, pr)
    if (m>0) set(x,y, 255,255,255, m*0.92)
  }

  // ── 5. Play triangle inside circle ────────────────────────────────────────
  const th = pr*0.72, tw = pr*0.66
  const tx0 = cx - tw*0.25, ty0 = cy
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    const relX = x - tx0, relY = y - ty0
    const inside = relX > 0 && relX < tw && Math.abs(relY) < (th/2)*(1 - relX/tw)
    if (inside) {
      const ci = circleMask(x,y, cx,cy, pr)
      if (ci>0) set(x,y, 124,58,237, ci)
    }
  }

  // ── 6. Sparkle top-right ──────────────────────────────────────────────────
  const sx = cx + S*0.22, sy = cy - S*0.22, ss = S*0.05
  const sparkPts = [[sx,sy-ss],[sx+ss*0.3,sy-ss*0.3],[sx+ss,sy],[sx+ss*0.3,sy+ss*0.3],[sx,sy+ss],[sx-ss*0.3,sy+ss*0.3],[sx-ss,sy],[sx-ss*0.3,sy-ss*0.3]]
  for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
    let minD = Infinity
    for (let i=0; i<sparkPts.length; i++) {
      const [ax,ay] = sparkPts[i], [bx,by] = sparkPts[(i+1)%sparkPts.length]
      const dx=bx-ax, dy=by-ay, t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1)
      minD = Math.min(minD, Math.sqrt((x-ax-t*dx)**2+(y-ay-t*dy)**2))
    }
    const m = clamp(ss*0.45-minD+1, 0, 1)
    if (m>0) set(x,y, 250,204,21, m*0.9) // yellow sparkle
  }

  return pixels
}

function makePNG(size) {
  const sig  = Buffer.from([137,80,78,71,13,10,26,10])
  const ihdr = pngChunk('IHDR', Buffer.concat([u32(size),u32(size),Buffer.from([8,2,0,0,0])]))

  const pixels = buildIcon(size)
  const rows   = []
  for (let y=0; y<size; y++) {
    const row = Buffer.alloc(1+size*3)
    row[0] = 0
    for (let x=0; x<size; x++) {
      const pi = (y*size+x)*3
      row[1+x*3]   = pixels[pi]
      row[2+x*3]   = pixels[pi+1]
      row[3+x*3]   = pixels[pi+2]
    }
    rows.push(row)
  }
  const raw  = Buffer.concat(rows)
  const comp = zlib.deflateSync(raw, { level:9 })
  return Buffer.concat([sig, ihdr, pngChunk('IDAT',comp), pngChunk('IEND',Buffer.alloc(0))])
}

const out = path.join(__dirname,'..','public')
fs.mkdirSync(out, { recursive:true })
for (const s of [192, 512]) {
  fs.writeFileSync(path.join(out,`icon-${s}.png`), makePNG(s))
  console.log(`✓  icon-${s}.png`)
}
