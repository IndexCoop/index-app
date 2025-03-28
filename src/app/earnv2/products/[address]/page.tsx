'use client'

import { useEffect } from 'react'

export default function Page() {
  //   const { isConnected } = useAccount()
  //   const { indexToken, products, balances } = useEarnContext()

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  return (
    <div className='mt-40 flex w-full flex-col items-center'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4'>
        <div></div>
      </div>
    </div>
  )
}
