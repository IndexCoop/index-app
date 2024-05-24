import { Flex } from '@chakra-ui/react'

import { LeverageBanner } from '@/components/banners/leverage-banner'
import { SwapBanner } from '@/components/banners/swap-banner'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { isLeverageSuiteEnabled } from '@/feature-flags'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      {isLeverageSuiteEnabled() ? <LeverageBanner /> : <SwapBanner />}
      <Header />
      <Flex direction='column' mb='50px'>
        <Flex maxWidth='1024px' m={['0 auto']} p='60px 16px 0px 16px'>
          {children}
        </Flex>
      </Flex>
      <Footer />
    </Providers>
  )
}
