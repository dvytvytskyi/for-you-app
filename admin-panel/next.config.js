/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api/v1',
  },
  images: {
    domains: ['localhost'],
    // Додайте домени для AWS S3 або Google Cloud Storage
  },
}

module.exports = nextConfig

