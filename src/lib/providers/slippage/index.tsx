'use client'

import { getTokenByChainAndSymbol, isAddressEqual } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { isAddress } from 'viem'

import { slippageDefault, slippageMap } from '@/constants/slippage'

import type { Address } from 'viem'

const icETH = getTokenByChainAndSymbol(1, 'icETH')

interface Context {
  isAuto: boolean
  slippage: number
  auto: () => void
  set: (slippage: number) => void
  setProductToken: (token: ProductToken) => void
}

type ProductToken = {
  address: Address
  chainId: number
}

export const SlippageContext = createContext<Context>({
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

  const setProductToken = (token: ProductToken) => {
    setSelectedProduct(token)
  }

  useQuery({
    enabled:
      selectedProduct?.address != null &&
      isAddress(selectedProduct?.address) &&
      isAuto,
    queryKey: ['auto-slippage', selectedProduct?.address, isAuto],
    queryFn: async () => {
      // const res = await fetch(
      //   `/api/slippage/${selectedProduct?.chainId}/${selectedProduct?.address}`,
      // )
      // const json = await res.json()
      // let slippage = json?.slippage as number
      // if (slippage) {
      //   slippage = Math.round(slippage * 10) / 10
      // } else {
      //   slippage = slippageDefault
      // }
      const isIcEth = isAddressEqual(selectedProduct?.address, icETH.address)
      const autoSlippage = isIcEth
        ? (slippageMap.get(icETH.address) ?? slippageDefault)
        : slippageDefault
      setAutoSlippage(autoSlippage)
      return autoSlippage
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
