'use client'

import { usePathname } from 'next/navigation'

import { Box, Flex } from '@chakra-ui/react'

import Footer from '@/components/page/Footer'
import Header from '@/components/page/header/Header'
import Page from '@/components/page/Page'
import QuickTradeContainer from '@/components/trade'

import { Providers } from './providers'

import '@rainbow-me/rainbowkit/styles.css'

export default function SwapPage() {
  const pathname = usePathname()
  console.log(pathname, 'path')

  return (
    <Providers>
      <Header />
      <Page>
        <Flex mx='auto'>
          <Box mb={12} w={['inherit', '500px']}>
            <QuickTradeContainer />
          </Box>
        </Flex>
      </Page>
      <Footer />
    </Providers>
  )
}
