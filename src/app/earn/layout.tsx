import { Providers } from '@/app/providers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

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
        <EarnProvider>
          <main>{children}</main>
        </EarnProvider>
        <Footer />
      </div>
    </Providers>
  )
}
