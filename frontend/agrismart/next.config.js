/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  assetPrefix: '/app',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // If you're using static export
  },
}

module.exports = nextConfig