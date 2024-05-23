import { Providers } from '@/app/providers'
import { LeverageBanner } from '@/components/banners/leverage-banner'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { LeverageProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Leverage',
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <div className='dark flex flex-col bg-[#141E1F]'>
        <LeverageBanner />
        <Header />
        <LeverageProvider>
          <main>{children}</main>
        </LeverageProvider>
        <Footer />
      </div>
    </Providers>
  )
}
