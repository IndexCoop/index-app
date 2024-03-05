import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <Header />
      <main className='bg-[#141E1F]'>{children}</main>
      <Footer />
    </Providers>
  )
}
