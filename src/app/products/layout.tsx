import { LeverageBanner } from '@/components/banners/leverage-banner'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { ProvidersLite } from '../providers-lite'

type Props = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Products',
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-fit flex-col bg-[url('/gradient-splash.jpg')] bg-cover">
      <ProvidersLite>
        <LeverageBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </ProvidersLite>
    </div>
  )
}
