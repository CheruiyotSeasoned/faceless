/**
 * Generates VAPID keys for Web Push notifications.
 * Run once: node scripts/generate-vapid.mjs
 * Copy the output into backend/.env
 */
import crypto from 'crypto'

const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
  publicKeyEncoding:  { type: 'spki',  format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'der' },
})

// Web Push uses raw 65-byte uncompressed public key (strip 26-byte SPKI header)
const pub = publicKey.slice(26).toString('base64url')
// Raw 32-byte private key (strip 36-byte PKCS8 header, take last 32 bytes)
const priv = privateKey.slice(-32).toString('base64url')

console.log('\nAdd these to backend/.env:\n')
console.log(`VAPID_PUBLIC_KEY=${pub}`)
console.log(`VAPID_PRIVATE_KEY=${priv}`)
console.log(`VAPID_SUBJECT=mailto:info@cliptokai.com`)
console.log('\nAdd this to frontend .env.production / Vercel env vars:\n')
console.log(`NEXT_PUBLIC_VAPID_KEY=${pub}`)
