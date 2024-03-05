import { Flex } from '@chakra-ui/react'

import Footer from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <Header />
      <Flex>{children}</Flex>
      <Footer />
    </Providers>
  )
}
