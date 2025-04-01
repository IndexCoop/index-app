import { Flex } from '@chakra-ui/react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='bg-ic-white dark:bg-ic-black h-full w-full'>
      <Providers>
        <Header />
        <Flex direction='column' mb='50px'>
          <Flex maxWidth='1024px' m={['0 auto']} p='60px 16px 0px 16px'>
            {children}
          </Flex>
        </Flex>
        <Footer />
      </Providers>
    </div>
  )
}
