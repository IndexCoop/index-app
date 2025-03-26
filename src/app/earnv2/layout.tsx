import { Providers } from '@/app/providers'
import { Header } from '@/components/header'
import { SlippageProvider } from '@/lib/providers/slippage'

import { LightEffect } from '@/app/leverage/components/light-effect'
import { getApiV2ProductsEarn } from '@/gen'
import React from 'react'
import { EarnProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Earn',
}

export default async function Layout({ children }: LayoutProps) {
  const productsResponse = await getApiV2ProductsEarn()
  const products = productsResponse.status === 200 ? productsResponse.data : []

  return (
    <Providers>
      <div className='dark flex flex-col overflow-x-hidden'>
        <LightEffect />
        <Header />
        <SlippageProvider>
          <EarnProvider products={products}>
            <main className='z-10'>{children}</main>
          </EarnProvider>
        </SlippageProvider>
      </div>
    </Providers>
  )
}
