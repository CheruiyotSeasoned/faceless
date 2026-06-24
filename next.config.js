/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack: (config, { dev }) => {
    // The gzipped filesystem cache is what crashes dev here (Gunzip → "Array
    // buffer allocation failed"). Use the in-memory cache in dev instead.
    if (dev) config.cache = { type: 'memory' }
    return config
  },
}

module.exports = nextConfig
