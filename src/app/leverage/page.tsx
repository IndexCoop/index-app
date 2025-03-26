'use client'

import { useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'

import { LeveragePanel } from '@/app/leverage/components/leverage-panel'

export default function Page() {
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
        <LeveragePanel />
      </div>
    </div>
  )
}
