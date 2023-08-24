/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/DPI',
        destination: '/swap',
      },
      {
        source: '/icETH ',
        destination: '/swap',
      },
      {
        source: '/MVI ',
        destination: '/swap',
      },
      {
        source: '/dsETH ',
        destination: '/swap',
      },
      {
        source: '/BED ',
        destination: '/swap',
      },
    ]
  },
}

module.exports = nextConfig
