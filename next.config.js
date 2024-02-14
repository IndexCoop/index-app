/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
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
        source: '/BTCFLI',
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
        source: '/ETHFLI',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/GTCETH',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/icETH ',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/ICSMMT ',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/MVI',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/ic21',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/cdeti',
        destination: '/swap',
        permanent: true,
      },
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

module.exports = nextConfig
