'use client'

import { createContext, useContext, useState } from 'react'

import { slippageDefault } from '@/constants/slippage'

interface Context {
  isAuto: boolean
  slippage: number
  auto: () => void
  set: (slippage: number) => void
}

export const SlippageContext = createContext<Context>({
  isAuto: true,
  slippage: slippageDefault,
  auto: () => {},
  set: () => {},
})

export const useSlippage = () => useContext(SlippageContext)

export const SlippageProvider = (props: { children: any }) => {
  const [isAuto, setIsAuto] = useState(true)
  const [slippage, setSlippage] = useState(slippageDefault)

  const auto = () => {
    setIsAuto(true)
    setSlippage(slippageDefault)
  }

  const set = (slippage: number) => {
    setIsAuto(false)
    setSlippage(slippage)
  }

  return (
    <SlippageContext.Provider
      value={{
        isAuto,
        slippage,
        auto,
        set,
      }}
    >
      {props.children}
    </SlippageContext.Provider>
  )
}
