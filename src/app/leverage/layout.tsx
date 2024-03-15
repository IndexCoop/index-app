'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { ProvidersLite } from '../providers-lite'
import { LeverageProvider } from './provider'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ProvidersLite>
      <div className='dark bg-[#141E1F]'>
        <Header />
        <LeverageProvider>
          <main>{children}</main>
        </LeverageProvider>
        <Footer />
      </div>
    </ProvidersLite>
  )
}
