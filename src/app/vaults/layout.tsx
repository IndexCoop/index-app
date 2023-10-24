'use client'

import { Flex } from '@chakra-ui/react'

import Footer from '@/components/footer'
import HeaderV2 from '@/components/header/header-v2'

import { Providers } from './providers'

export default function VaultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <HeaderV2 />
      <Flex direction='column' mb='50px'>
        <Flex
          maxWidth='1024px'
          m='0 auto'
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
