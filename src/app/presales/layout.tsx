import { Providers } from '@/app/providers'
import { LeverageBanner } from '@/components/banners/leverage-banner'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { isLeverageSuiteEnabled } from '@/lib/utils/feature-flags'

type Props = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Presales',
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-fit flex-col bg-[url('/presale-splash.jpg')] bg-cover">
      <Providers>
        {isLeverageSuiteEnabled() && <LeverageBanner />}
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </div>
  )
}
