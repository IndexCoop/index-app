'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { isAddress } from 'viem'

import { slippageDefault } from '@/constants/slippage'
import { getSlippage } from '@/lib/actions/slippage'

import type { Address } from 'viem'

interface Context {
  isAuto: boolean
  slippage: number
  auto: () => void
  set: (slippage: number) => void
  setProductToken: (token: ProductToken, isMinting: boolean) => void
}

type ProductToken = {
  address: Address
  chainId: number
}

const SlippageContext = createContext<Context>({
  isAuto: true,
  slippage: slippageDefault,
  auto: () => {},
  set: () => {},
  setProductToken: () => {},
})

export const useSlippage = () => useContext(SlippageContext)

export const SlippageProvider = (props: { children: any }) => {
  const [autoSlippage, setAutoSlippage] = useState(slippageDefault)
  const [customSlippage, setCustomSlippage] = useState(slippageDefault)
  const [isAuto, setIsAuto] = useState(true)
  const [isMinting, setMinting] = useState<boolean>(true)
  const [selectedProduct, setSelectedProduct] = useState<ProductToken | null>(
    null,
  )

  const auto = () => {
    setIsAuto(true)
  }

  const set = (slippage: number) => {
    setCustomSlippage(slippage)
    setIsAuto(false)
  }
  const slippage = useMemo(() => {
    return isAuto ? autoSlippage : customSlippage
  }, [isAuto, autoSlippage, customSlippage])

  const setProductToken = (token: ProductToken, isMinting: boolean) => {
    setSelectedProduct(token)
    setMinting(isMinting)
  }

  useQuery({
    enabled:
      selectedProduct?.address != null &&
      isAddress(selectedProduct?.address) &&
      isAuto,
    queryKey: ['auto-slippage', selectedProduct?.address, isAuto, isMinting],
    queryFn: async () => {
      const { data, status } = await getSlippage(
        selectedProduct!.chainId.toString(),
        selectedProduct!.address,
      )
      if (status !== 200 || !data) {
        setAutoSlippage(slippageDefault)
        return slippageDefault
      }
      let slippage = data.slippage as number
      if (slippage) {
        slippage = Math.round(slippage * 10) / 10
      } else {
        slippage = slippageDefault
      }
      setAutoSlippage(slippage)
      return slippage
    },
  })

  return (
    <SlippageContext.Provider
      value={{
        isAuto,
        slippage,
        auto,
        set,
        setProductToken,
      }}
    >
      {props.children}
    </SlippageContext.Provider>
  )
}
