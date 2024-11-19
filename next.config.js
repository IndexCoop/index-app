/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tokens.1inch.io',
      },
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
        destination: '/products',
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

// Injected content via Sentry wizard below

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'index-coop-e5',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
})
