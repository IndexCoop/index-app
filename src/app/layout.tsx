import './globals.css'
import { SafaryScript } from '@/components/external/safary-script'

export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#000000',
  title: 'Index App | Buy & Sell Our Tokens',
  description:
    'Use the Index Coop Trading App to buy and sell our sector, leveraged and yield generating tokens.',
  type: 'website',
}

type LayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='en'>
      <body>
        {children}
        <SafaryScript />
      </body>
    </html>
  )
}
