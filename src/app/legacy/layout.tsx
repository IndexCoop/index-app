'use client'

import { Providers } from '@/app/providers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { RedeemProvider } from './providers/redeem-provider'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-fit flex-col bg-[url('/presale-splash.jpg')] bg-cover">
      <Providers>
        <Header />
        <RedeemProvider>
          <main>{children}</main>
        </RedeemProvider>
        <Footer />
      </Providers>
    </div>
  )
}
