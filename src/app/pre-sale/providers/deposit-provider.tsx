import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { usePublicClient } from 'wagmi'

import { HighYieldETHIndex, Token, WSTETH } from '@/constants/tokens'
import { getEnhancedIssuanceQuote } from '@/lib/hooks/use-best-quote/utils/issuance'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, toWei } from '@/lib/utils'
import { GasStation } from '@/lib/utils/api/gas-station'

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
  const nativeTokenPrice = useNativeTokenPrice(1)
  const publicClient = usePublicClient()
  const { provider, signer } = useWallet()

  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [inputValue, setInputValue] = useState('')
  const [isDepositing, setDepositing] = useState<boolean>(true)

  const inputToken = useMemo(
    () => (isDepositing ? preSaleCurrencyToken : preSaleToken),
    [isDepositing, preSaleCurrencyToken, preSaleToken],
  )

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : toWei(inputValue, inputToken.decimals).toBigInt(),
    [inputToken, inputValue],
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

  useEffect(() => {
    const fetchQuote = async () => {
      const outputToken = isDepositing ? preSaleToken : preSaleCurrencyToken
      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)
      const gasStation = new GasStation(provider)
      const gasPrice = await gasStation.getGasPrice()
      const quoteIssuance = await getEnhancedIssuanceQuote(
        {
          isIssuance: isDepositing,
          gasPrice: gasPrice.toBigInt(),
          indexTokenAmount: inputTokenAmount,
          inputToken,
          inputTokenPrice,
          outputToken,
          outputTokenPrice,
          nativeTokenPrice,
          slippage: 0,
        },
        publicClient,
        signer,
      )
      console.log(
        inputTokenAmount.toString(),
        quoteIssuance?.indexTokenAmount.toString(),
        quoteIssuance?.inputOutputTokenAmount.toString(),
        'issuance-quote',
      )
    }
    fetchQuote()
  }, [
    inputToken,
    inputTokenAmount,
    isDepositing,
    nativeTokenPrice,
    preSaleCurrencyToken,
    preSaleToken,
    provider,
    publicClient,
    signer,
  ])

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
