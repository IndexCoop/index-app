import { Providers } from '@/app/providers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { YieldProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Yield',
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <div className='flex flex-col'>
        <Header />
        <YieldProvider>
          <main>{children}</main>
        </YieldProvider>
        <Footer />
      </div>
    </Providers>
  )
}
