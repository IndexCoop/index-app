import { headers } from 'next/headers'

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
  const cookies = headers().get('cookie')

  return (
    <Providers cookies={cookies}>
      <div className='dark flex flex-col bg-[#141E1F]'>
        <Header />
        <LeverageProvider>
          <main>{children}</main>
        </LeverageProvider>
        <Footer />
      </div>
    </Providers>
  )
}
