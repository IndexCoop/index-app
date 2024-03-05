import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { ProvidersLite } from '../providers-lite'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ProvidersLite>
      <Header />
      <main className='bg-[#141E1F]'>{children}</main>
      <Footer />
    </ProvidersLite>
  )
}
