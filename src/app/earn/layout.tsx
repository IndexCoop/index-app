import React from 'react'

import { Providers } from '@/app/providers'
import BackgroundLight from '@/components/background-light'
import { Header } from '@/components/header'
import { getApiV2ProductsEarn } from '@/gen'
import { SlippageProvider } from '@/lib/providers/slippage'

import { Footer } from '@/components/footer'
import { EarnProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Earn',
}

export default async function Layout({ children }: LayoutProps) {
  const productsResponse = await getApiV2ProductsEarn({
    headers: { 'Cache-Control': 'no-cache' },
  })
  const products =
    productsResponse.status === 200
      ? productsResponse.data.sort((a, b) => a.order - b.order)
      : []

  return (
    <div className='relative h-[100dvh] w-full bg-zinc-950'>
      <Providers>
        <div className='dark flex h-[100dvh] flex-col overflow-hidden'>
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(10, 70, 200, 0.4) 40%, transparent 70%)'
            className='-bottom-[25%] left-[40%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(50, 130, 170, 0.6) 40%, transparent 70%)'
            className='-top-[30%] left-[10%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(32, 214, 240, 0.35) 40%, transparent 70%)'
            className='-right-[10%] top-[10%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(30, 206, 162, 0.35) 40%, transparent 70%)'
            className='-left-[10%] bottom-0'
          />
          <Header />
          <SlippageProvider>
            <EarnProvider products={products}>
              <main className='z-10 flex-1 overflow-y-auto'>{children}</main>
            </EarnProvider>
          </SlippageProvider>
        </div>
        <Footer />
      </Providers>
    </div>
  )
}

export const dynamic = 'force-dynamic'
