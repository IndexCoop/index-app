import './globals.css'

import { Flex } from '@chakra-ui/react'

import { Banner } from '@/components/banners'
import Footer from '@/components/footer'
import { Header } from '@/components/header'

import { SafaryScript } from '@/components/external/safary-script'
import { Providers } from './providers'

// For images just place the appropriate image file in this folder.
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#image-files-jpg-png-gif
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#000000',
  title: 'Index App | Buy & Sell Our Tokens',
  description:
    'Use the Index Coop Trading App to buy and sell our sector, leveraged and yield generating tokens.',
  type: 'website',
}

type LayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Banner />
          <Header />
          <Flex direction='column' mb='50px'>
            <Flex
              maxWidth='1024px'
              m={['0 auto']}
              p={[
                '100px 16px 0px 16px',
                '100px 16px 0px 16px',
                '128px 16px 0px 16px',
                '128px 16px 0px 16px',
              ]}
            >
              {children}
            </Flex>
          </Flex>
          <Footer />
        </Providers>
        <SafaryScript />
      </body>
    </html>
  )
}
