import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='bg-ic-white dark:bg-ic-black h-full w-full'>
      <Providers>
        <Header />
        <div className='mb-[50px] flex flex-col'>
          <div className='mx-auto my-0 flex max-w-5xl px-4 pt-[60px]'>
            {children}
          </div>
        </div>
        <Footer />
      </Providers>
    </div>
  )
}
