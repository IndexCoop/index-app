import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '@/app/providers'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-fit flex-col bg-[url('/gradient-splash.jpg')] bg-top">
      <Providers>
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </div>
  )
}
