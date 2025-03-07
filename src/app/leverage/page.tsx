'use client'

import { useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'

import { LeveragePanel } from '@/app/leverage/components/leverage-panel'
import { QuickStats } from '@/app/leverage/components/stats/index'
import { useLeverageToken } from '@/app/leverage/provider'

import { FaqSection } from './components/faq-section'

export default function Page() {
  const { indexToken } = useLeverageToken()
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode()
    }

    return () => {
      if (colorMode === 'dark') {
        toggleColorMode()
      }
    }
  }, [colorMode, toggleColorMode])

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  })

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-4 px-4 py-4 md:gap-6 md:py-6'>
          <QuickStats />
          <LeveragePanel indexToken={indexToken} />
          <FaqSection />
        </div>
      </div>
    </div>
  )
}
