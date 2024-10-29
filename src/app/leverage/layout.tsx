import { Providers } from '@/app/providers'
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
      <div className='bg-ic-dark dark flex flex-col'>
        <Header />
        <LeverageProvider>
          <main>{children}</main>
        </LeverageProvider>
        <Footer />
      </div>
    </Providers>
  )
}
