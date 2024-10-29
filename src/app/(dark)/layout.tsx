import { MavaScript } from '@/components/external/mava-script'
import { SafaryScript } from '@/components/external/safary-script'
import '../globals.css'

export const metadata = {
  manifest: '/manifest.json',
  metadataBase: new URL('https://app.indexcoop.com'),
  title: {
    template: '%s | Index Coop',
    default: 'Index App | Buy & Sell Our Tokens',
  },
  description:
    'Use the Index Coop Trading App to buy and sell our sector, leveraged and yield generating tokens.',
  type: 'website',
}

export const viewport = {
  themeColor: '#141E1F',
}

type LayoutProps = {
  children: React.ReactNode
}

export default function RootDarkLayout({ children }: LayoutProps) {
  return (
    <html lang='en'>
      <body className='dark bg-[#141E1F]'>
        {children}
        <SafaryScript />
        <MavaScript />
      </body>
    </html>
  )
}
