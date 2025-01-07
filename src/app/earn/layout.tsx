import { Providers } from '@/app/providers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SlippageProvider } from '@/lib/providers/slippage'

import { EarnProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Earn',
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <div className='flex flex-col'>
        <Header />
        <SlippageProvider>
          <EarnProvider>
            <main>{children}</main>
          </EarnProvider>
        </SlippageProvider>
        <Footer />
      </div>
    </Providers>
  )
}
