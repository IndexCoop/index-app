import { headers } from 'next/headers'

import { Providers } from '@/app/providers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

type Props = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Products',
}

export default function Layout({ children }: Props) {
  const cookies = headers().get('cookie')
  return (
    <div className="flex h-fit flex-col bg-[url('/gradient-splash.jpg')] bg-cover">
      <Providers cookies={cookies}>
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </div>
  )
}
