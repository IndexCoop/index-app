import { createContext, useCallback, useContext, useState } from 'react'

import { Token, WSTETH } from '@/constants/tokens'
import { getDefaultIndex } from '@/lib/utils/tokens'

interface DepositContextProps {
  isDepositing: boolean
  preSaleCurrencyToken: Token
  preSaleToken: Token
  userBalance: bigint
  toggleIsDepositing: () => void
}

const DepositContext = createContext<DepositContextProps>({
  isDepositing: true,
  preSaleCurrencyToken: WSTETH,
  preSaleToken: getDefaultIndex(),
  userBalance: BigInt(0),
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: { children: any; preSaleToken: Token }) {
  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [isDepositing, setDepositing] = useState<boolean>(true)
  const [userBalance, setUserBalance] = useState(BigInt(0))

  const toggleIsDepositing = useCallback(() => {
    setDepositing(!isDepositing)
  }, [isDepositing])

  return (
    <DepositContext.Provider
      value={{
        isDepositing,
        preSaleCurrencyToken,
        preSaleToken,
        userBalance,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
