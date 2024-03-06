import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { ProvidersLite } from '../providers-lite'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ProvidersLite>
      <div className='dark bg-[#141E1F]'>
        <Header isDarkMode={true} />
        <main>{children}</main>
        <Footer />
      </div>
    </ProvidersLite>
  )
}
