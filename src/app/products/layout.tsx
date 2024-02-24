import '../globals.css'

import { Metadata } from 'next'
import { Footer } from '@/app/products/components/footer'
import { Header } from '@/components/header'
import { ProvidersLite } from '../providers-lite'

export const metadata: Metadata = {
  title: {
    template: '%s | Index Coop',
    default: 'App | Index Coop',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='h-full'>
      <body className="h-fit flex flex-col bg-[url('/gradient-splash.jpg')] bg-top backdrop-blur-3xl">
        <ProvidersLite>
          <Header />
          <main>{children}</main>
          <Footer />
        </ProvidersLite>
      </body>
    </html>
  )
}
