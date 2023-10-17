/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/BED',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/DPI',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/dsETH',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/icETH ',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/MVI',
        destination: '/swap',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
