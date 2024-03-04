import { Flex } from '@chakra-ui/react'

import { Banner } from '@/components/banners'
import Footer from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
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
  )
}
