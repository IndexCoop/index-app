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
        hostname: 'index-app.vercel.app',
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
        source: '/pre-sales',
        destination: '/presales',
        permanent: true,
      },
      {
        source: '/',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(B|b)(E|e)(D|d)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(B|b)(T|t)(C|c)(F|f)(L|l)(I|i)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(D|d)(P|p)(I|i)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(D|d)(S|s)(E|e)(T|t)(H|h)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(E|e)(T|t)(H|h)(F|f)(L|l)(I|i)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(G|g)(T|t)(C|c)(E|e)(T|t)(H|h)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(I|i)(C|c)(E|e)(T|t)(H|h)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(I|i)(C|c)(S|s)(M|m)(M|m)(T|t) ',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(M|m)(V|v)(I|i)',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(I|i)(C|c)21',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/(C|c)(D|d)(E|e)(T|t)(I|i)',
        destination: '/swap',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/swap/manifest.json',
        destination: '/manifest.json',
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
