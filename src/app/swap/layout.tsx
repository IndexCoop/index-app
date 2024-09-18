import { Flex } from '@chakra-ui/react'
import { headers } from 'next/headers'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const cookies = headers().get('cookie')

  return (
    <Providers cookies={cookies}>
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
