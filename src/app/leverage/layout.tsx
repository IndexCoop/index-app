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
      <Flex className='bg-[#141E1F]'>{children}</Flex>
      <Footer />
    </Providers>
  )
}
