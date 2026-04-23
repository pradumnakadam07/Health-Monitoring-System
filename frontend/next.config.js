/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/chat',
        destination: 'http://localhost:5001/api/chat',
      },
      {
        source: '/api/health-tips',
        destination: 'http://localhost:5001/health-tips',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:5002/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
