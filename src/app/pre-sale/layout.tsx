import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '@/app/providers'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <Providers>
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </div>
  )
}
