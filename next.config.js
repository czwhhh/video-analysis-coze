/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/video-analysis',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  },
}

module.exports = nextConfig 