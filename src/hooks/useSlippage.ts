import { useState } from 'react'

// Slippage default hard coded to 1%
export const slippageDefault = 1

export const useSlippage = () => {
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

  return { auto, isAuto, set, slippage }
}
