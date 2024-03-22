import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { HighYieldETHIndex, Token, WSTETH } from '@/constants/tokens'
import { isValidTokenInput } from '@/lib/utils'

interface DepositContextProps {
  inputValue: string
  isDepositing: boolean
  preSaleCurrencyToken: Token
  preSaleToken: Token
  onChangeInputTokenAmount: (input: string) => void
  toggleIsDepositing: () => void
}

const DepositContext = createContext<DepositContextProps>({
  inputValue: '',
  isDepositing: true,
  preSaleCurrencyToken: WSTETH,
  preSaleToken: HighYieldETHIndex,
  onChangeInputTokenAmount: () => {},
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: { children: any; preSaleToken: Token }) {
  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [inputValue, setInputValue] = useState('')
  const [isDepositing, setDepositing] = useState<boolean>(true)

  const inputToken = useMemo(
    () => (isDepositing ? preSaleCurrencyToken : preSaleToken),
    [isDepositing, preSaleCurrencyToken, preSaleToken],
  )

  const onChangeInputTokenAmount = useCallback(
    (input: string) => {
      if (input === '') {
        // TODO:
        // resetTradeData()
      }
      // setInputTokenAmountFormatted(input || '')
      if (!isValidTokenInput(input, inputToken.decimals)) return
      setInputValue(input || '')
    },
    [inputToken],
  )

  const toggleIsDepositing = useCallback(() => {
    setDepositing(!isDepositing)
  }, [isDepositing])

  return (
    <DepositContext.Provider
      value={{
        inputValue,
        isDepositing,
        preSaleCurrencyToken,
        preSaleToken,
        onChangeInputTokenAmount,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
