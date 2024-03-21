import { createContext, useCallback, useContext, useState } from 'react'

import { Token, WSTETH } from '@/constants/tokens'
import { getDefaultIndex } from '@/lib/utils/tokens'

interface DepositContextProps {
  isDepositing: boolean
  preSaleCurrencyToken: Token
  preSaleToken: Token
  toggleIsDepositing: () => void
}

const DepositContext = createContext<DepositContextProps>({
  isDepositing: true,
  preSaleCurrencyToken: WSTETH,
  preSaleToken: getDefaultIndex(),
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: { children: any; preSaleToken: Token }) {
  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [isDepositing, setDepositing] = useState<boolean>(true)

  const toggleIsDepositing = useCallback(() => {
    setDepositing(!isDepositing)
  }, [isDepositing])

  return (
    <DepositContext.Provider
      value={{
        isDepositing,
        preSaleCurrencyToken,
        preSaleToken,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
