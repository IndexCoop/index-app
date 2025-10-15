import BackgroundLight from '@/components/background-light'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { Providers } from '../providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='relative h-full w-full overflow-hidden bg-zinc-950'>
      <Providers>
        <div className='dark flex h-full flex-col overflow-hidden'>
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(0, 74, 80, 0.6) 40%, transparent 70%)'
            className='-bottom-[25%] left-[40%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(58, 122, 192, 0.5) 40%, transparent 70%)'
            className='-top-[30%] left-[10%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(92, 179, 179, 0.4) 40%, transparent 70%)'
            className='-right-[10%] top-[10%]'
          />
          <BackgroundLight
            background='radial-gradient(circle at center, rgba(7, 122, 82, 0.4) 40%, transparent 70%)'
            className='-left-[10%] bottom-0'
          />
          <Header />
          <div className='z-10 mb-[50px] flex flex-col'>
            <div className='mx-auto my-0 flex max-w-5xl px-4 pt-[60px]'>
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </Providers>
    </div>
  )
}
