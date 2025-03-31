import React from 'react'

import { LightEffect } from '@/app/leverage/components/light-effect'
import { Providers } from '@/app/providers'
import { Header } from '@/components/header'
import { getApiV2ProductsEarn } from '@/gen'
import { SlippageProvider } from '@/lib/providers/slippage'

import { EarnProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Earn',
}

export default async function Layout({ children }: LayoutProps) {
  const productsResponse = await getApiV2ProductsEarn()
  const products =
    productsResponse.status === 200
      ? productsResponse.data.sort((a, b) => a.order - b.order)
      : []

  return (
    <div className='bg-ic-black h-full w-full'>
      <Providers>
        <div className='dark flex flex-col overflow-x-hidden'>
          <Header />
          <SlippageProvider>
            <EarnProvider products={products}>
              <LightEffect page='earn' />
              <main className='z-10 p-4'>{children}</main>
            </EarnProvider>
          </SlippageProvider>
        </div>
      </Providers>
    </div>
  )
}
