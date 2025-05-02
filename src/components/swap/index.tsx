import { Button } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SwapNavigation } from '@/components/swap/components/navigation'
import { ARBITRUM, MAINNET } from '@/constants/chains'
import { useBestQuote } from '@/lib/hooks/use-best-quote'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useGasData } from '@/lib/hooks/use-gas-data'
import { useIsTokenPairTradable } from '@/lib/hooks/use-is-token-pair-tradable'
import { useNetwork, useSupportedNetworks } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'
import { useSlippage } from '@/lib/providers/slippage'
import { formatWei, isValidTokenInput, parseUnits } from '@/lib/utils'
import { getMaxBalance } from '@/lib/utils/max-balance'
import { selectSlippage } from '@/lib/utils/slippage'
import { getTokenBySymbol } from '@/lib/utils/tokens'

import { SelectTokenModal } from './components/select-token-modal'
import { TradeDetails } from './components/trade-details'
import {
  type InputSelectorToken,
  TradeInputSelector,
} from './components/trade-input-selector'
import { TradeOutput } from './components/trade-output'
import { TransactionReviewModal } from './components/transaction-review'
import { useSwap } from './hooks/use-swap'
import { useTokenlists } from './hooks/use-tokenlists'

import type { Token } from '@/constants/tokens'

type SwapProps = {
  isBuying: boolean
  inputToken: Token
  outputToken: Token
}

export const Swap = (props: SwapProps) => {
  const { inputToken, isBuying, outputToken } = props
  const gasData = useGasData()
  const isSupportedNetwork = useSupportedNetworks([
    MAINNET.chainId,
    ARBITRUM.chainId,
  ])
  const { chainId } = useNetwork()
  const { slippage } = useSlippage()
  const { address } = useWallet()

  const isTradablePair = useIsTokenPairTradable(
    outputToken.symbol,
    chainId ?? 1,
  )

  const {
    isOpen: isSelectInputTokenOpen,
    onOpen: onOpenSelectInputToken,
    onClose: onCloseSelectInputToken,
  } = useDisclosure()
  const {
    isOpen: isSelectOutputTokenOpen,
    onOpen: onOpenSelectOutputToken,
    onClose: onCloseSelectOutputToken,
  } = useDisclosure()

  const {
    fetchQuote,
    isFetchingAnyQuote,
    isFetching0x,
    isFetchingFlashmint,
    quoteResults,
  } = useBestQuote(isBuying, inputToken, outputToken)

  const hasFetchingError = false // quoteResults.error !== null && !isFetchingAnyQuote

  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null)
  const [sellTokenAmount, setSellTokenAmount] = useDebounce('0', 300)
  const [tradeState, sendTradeEvent] = useAtom(tradeMachineAtom)

  const { selectInputToken, selectOutputToken, toggleIsMinting } =
    useSelectedToken()
  const { inputTokenslist, outputTokenslist } = useTokenlists(
    chainId ?? 1,
    isBuying,
    inputToken,
    outputToken,
  )

  const {
    contract,
    hasInsufficientFunds,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    formattedQuoteResults,
    showWarning,
    tokenPrices,
    tradeData,
  } = useSwap(
    inputToken,
    outputToken,
    sellTokenAmount,
    quoteResults,
    selectedQuote,
    isFetchingAnyQuote,
    isFetching0x,
    isFetchingFlashmint,
  )

  useEffect(() => {
    setSelectedQuote(quoteResults?.bestQuote)
  }, [quoteResults])

  useEffect(() => {
    const quote = quoteResults?.results[selectedQuote ?? QuoteType.index]
    if (!quote) return
    sendTradeEvent({
      type: 'QUOTE',
      quoteResult: quote,
      quoteType: quote.type,
    })
  }, [quoteResults, selectedQuote, sendTradeEvent])

  const resetTradeData = useCallback(() => {
    setInputTokenAmountFormatted('')
    setSellTokenAmount('0')
  }, [setSellTokenAmount])

  useEffect(() => {
    resetTradeData()
  }, [chainId, resetTradeData])

  useEffect(() => {
    if (tradeState.matches('reset')) {
      resetTradeData()
      sendTradeEvent({ type: 'RESET_DONE' })
    }
  }, [tradeState, resetTradeData, sendTradeEvent])

  const fetchOptions = useCallback(() => {
    if (!isTradablePair) return
    const indexSymbol = isBuying ? outputToken.symbol : inputToken.symbol
    fetchQuote({
      isMinting: isBuying,
      inputToken,
      inputTokenAmount: sellTokenAmount,
      outputToken,
      slippage: selectSlippage(slippage, indexSymbol),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isBuying,
    inputToken,
    isTradablePair,
    outputToken,
    sellTokenAmount,
    slippage,
  ])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  const onChangeInputTokenAmount = (
    token: InputSelectorToken,
    input: string,
  ) => {
    if (input === '') {
      resetTradeData()
    }
    setInputTokenAmountFormatted(input || '')
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '')
  }

  const onClickInputBalance = useCallback(() => {
    if (!inputTokenBalance) return
    const maxBalanceBigNumber = getMaxBalance(
      inputToken,
      parseUnits(inputTokenBalance, inputToken.decimals),
      gasData,
    )
    const maxBalance = formatWei(maxBalanceBigNumber, inputToken.decimals)
    setInputTokenAmountFormatted(maxBalance)
    setSellTokenAmount(maxBalance)
  }, [gasData, inputToken, inputTokenBalance, setSellTokenAmount])

  const onSwitchTokens = () => {
    toggleIsMinting()
    resetTradeData()
  }

  return (
    <div className='border-ic-gray-100 swap-widget flex h-full flex-col rounded-3xl border px-4 pb-4 pt-2'>
      <SwapNavigation />
      <div className='mx-0 mb-1.5 mt-1 flex flex-col'>
        <TradeInputSelector
          balance={inputTokenBalanceFormatted}
          caption='You pay'
          formattedFiat={inputTokenAmountUsd}
          selectedToken={inputToken}
          selectedTokenAmount={inputTokenAmountFormatted}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={onClickInputBalance}
          onSelectToken={() => {
            if (inputTokenslist.length > 1) onOpenSelectInputToken()
          }}
        />
        <div className='flex h-1.5 self-center'>
          <Button
            className='text-ic-gray-400 border-ic-gray-400 bg-ic-white hover:bg-ic-gray-100 relative z-50 flex self-center rounded-lg border px-2 py-1'
            aria-label='switch input/output tokens'
            onClick={onSwitchTokens}
          >
            <ChevronUpDownIcon className='h-7 w-5 text-gray-500' />
          </Button>
        </div>
        <TradeOutput
          caption={'You receive'}
          selectedToken={outputToken}
          selectedQuote={selectedQuote}
          quotes={formattedQuoteResults}
          onSelectQuote={(quoteType) => setSelectedQuote(quoteType)}
          onSelectToken={() => {
            if (outputTokenslist.length > 1) onOpenSelectOutputToken()
          }}
        />
      </div>
      <>
        {tradeData.length > 0 && (
          <TradeDetails
            data={tradeData}
            isLoading={isFetchingAnyQuote}
            prices={tokenPrices}
            showWarning={showWarning}
            selectedQuoteType={selectedQuote ?? QuoteType.index}
          />
        )}
        {hasFetchingError && (
          <p className='text-ic-red p-4 text-center'>
            {'Error fetching quote'}
          </p>
        )}
        <SmartTradeButton
          contract={contract ?? ''}
          hasFetchingError={hasFetchingError}
          hasInsufficientFunds={hasInsufficientFunds}
          inputTokenAmount={inputTokenAmountWei}
          inputToken={inputToken}
          inputValue={sellTokenAmount}
          isFetchingQuote={isFetchingAnyQuote}
          isSupportedNetwork={isSupportedNetwork}
          outputToken={outputToken}
          buttonLabelOverrides={{}}
          onOpenTransactionReview={() => sendTradeEvent({ type: 'REVIEW' })}
          onRefetchQuote={fetchOptions}
        />
      </>
      <SelectTokenModal
        isOpen={isSelectInputTokenOpen}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol) => {
          selectInputToken(getTokenBySymbol(tokenSymbol)!)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokenslist}
      />
      <SelectTokenModal
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol) => {
          selectOutputToken(getTokenBySymbol(tokenSymbol)!)
          onCloseSelectOutputToken()
        }}
        address={address}
        tokens={outputTokenslist}
      />
      <TransactionReviewModal
        onClose={() => sendTradeEvent({ type: 'CLOSE' })}
      />
    </div>
  )
}
