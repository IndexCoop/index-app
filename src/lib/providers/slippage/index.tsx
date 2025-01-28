'use client'

import { createContext, useContext, useState } from 'react'

import { slippageDefault, slippageMap } from '@/constants/slippage'

interface Context {
  isAuto: boolean
  slippage: number
  auto: () => void
  set: (slippage: number) => void
  setSlippageForToken: (tokenSymbol: string) => void
}

export const SlippageContext = createContext<Context>({
  isAuto: true,
  slippage: slippageDefault,
  auto: () => {},
  set: () => {},
  setSlippageForToken: () => {},
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

  const setSlippageForToken = (tokenSymbol: string) => {
    const slippageTokenDefault = slippageMap.get(tokenSymbol)
    if (!slippageTokenDefault) return
    setIsAuto(false)
    setSlippage(slippageTokenDefault)
  }

  return (
    <SlippageContext.Provider
      value={{
        isAuto,
        slippage,
        auto,
        set,
        setSlippageForToken,
      }}
    >
      {props.children}
    </SlippageContext.Provider>
  )
}
