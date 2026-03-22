/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  assetPrefix: '/app',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig