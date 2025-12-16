import { Providers } from '@/app/providers'
import BackgroundLight from '@/components/background-light'
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
    <div className='relative h-[100dvh] w-full overflow-hidden bg-zinc-950'>
      <Providers>
        <div className='dark flex h-[100dvh] flex-col overflow-hidden'>
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(0, 74, 80, 0.6) 40%, transparent 70%)'
            className='-bottom-[25%] left-[40%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(58, 122, 192, 0.5) 40%, transparent 70%)'
            className='-top-[30%] left-[10%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(92, 179, 179, 0.4) 40%, transparent 70%)'
            className='-right-[10%] top-[10%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(7, 122, 82, 0.4) 40%, transparent 70%)'
            className='-left-[10%] bottom-0'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(92, 179, 179, 0.3) 40%, transparent 70%)'
            className='bottom-0 left-[20%]'
          />
          <Header />
          <div className='z-10 flex-1 overflow-y-auto'>
            <SlippageProvider>
              <LeverageProvider>
                <main>{children}</main>
              </LeverageProvider>
            </SlippageProvider>
            <Footer />
          </div>
        </div>
      </Providers>
    </div>
  )
}
