import { LightEffect } from '@/app/leverage/components/light-effect'
import { Providers } from '@/app/providers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SlippageProvider } from '@/lib/providers/slippage'

import { LeverageProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Leverage Suite',
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <div className='dark flex flex-col overflow-x-hidden'>
        <Header />
        <SlippageProvider>
          <LeverageProvider>
            <LightEffect page='leverage' />
            <main className='z-10'>{children}</main>
          </LeverageProvider>
        </SlippageProvider>
        <Footer />
      </div>
    </Providers>
  )
}
