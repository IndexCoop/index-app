import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { Settings } from '@/components/settings'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/use-approval'
import { useNetwork } from '@/lib/hooks/use-network'
import { useBestQuote } from '@/lib/hooks/use-best-quote'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useTokenlists } from '@/lib/hooks/use-tokenlists'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useProtection } from '@/lib/providers/protection'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'
import { useSlippage } from '@/lib/providers/slippage'
import { colors } from '@/lib/styles/colors'
import { isValidTokenInput } from '@/lib/utils'
import { getNativeToken, getTokenBySymbol } from '@/lib/utils/tokens'

import { SelectTokenModal } from './components/select-token-modal'
import { TradeDetails } from './components/trade-details'
import { TradeInputSelector } from './components/trade-input-selector'
import { TransactionReviewModal } from './components/transaction-review'
import { Warnings, WarningType } from './components/warning'
import { useSwap } from './hooks/use-swap'
import { useTradeButton } from './hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'
import { useTransactionReviewModal } from './hooks/use-transaction-review-modal'
import { TradeOutput } from './components/trade-output'

type SwapProps = {
  isBuying: boolean
  inputToken: Token
  outputToken: Token
}

export const Swap = (props: SwapProps) => {
  const { inputToken, isBuying, outputToken } = props
  const { openConnectModal } = useConnectModal()
  const requiresProtection = useProtection()
  const { chainId } = useNetwork()
  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()
  const { address } = useWallet()

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
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  const {
    fetchQuote,
    isFetching: isFetchingQuote,
    quoteResult,
  } = useBestQuote()

  const hasFetchingError = quoteResult.error !== null && !isFetchingQuote

  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null)
  const [sellTokenAmount, setSellTokenAmount] = useDebounce('0', 500)
  const [warnings, setWarnings] = useState<WarningType[]>([])

  const { selectInputToken, selectOutputToken, toggleIsMinting } =
    useSelectedToken()
  const { inputTokenslist, outputTokenslist } = useTokenlists(
    isBuying,
    inputToken,
    outputToken
  )
  const { transactionReview } = useTransactionReviewModal(
    quoteResult,
    selectedQuote,
    isFetchingQuote
  )

  const {
    contract,
    hasInsufficientFunds,
    gasCostsUsd,
    // inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice,
    outputTokenAmountFormatted,
    outputTokenAmountUsd,
    outputTokenBalanceFormatted,
    outputTokenPrice,
    priceImpactFormatting,
    showWarning,
    tokenPrices,
    tradeData,
  } = useSwap(
    inputToken,
    outputToken,
    sellTokenAmount,
    quoteResult,
    isFetchingQuote,
    selectedQuote
  )

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(inputToken, contract, inputTokenAmountWei.toBigInt())

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === inputToken.symbol
    return !isNativeToken
  }, [chainId, inputToken])

  const buttonState = useTradeButtonState(
    hasFetchingError,
    hasInsufficientFunds,
    shouldApprove,
    isApprovedForSwap,
    isApprovingForSwap,
    sellTokenAmount
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  const isToggleDisabled = useMemo(
    () =>
      quoteResult.quotes.flashmint === null ||
      quoteResult.quotes.zeroex === null,
    [quoteResult]
  )

  useEffect(() => {
    if (requiresProtection) {
      setWarnings([WarningType.restricted])
      return
    }
    if (slippage > 9) {
      setWarnings([WarningType.priceImpact])
      return
    }
    setWarnings([WarningType.flashbots])
  }, [requiresProtection, slippage])

  useEffect(() => {
    console.log('/////////')
    console.log(quoteResult.bestQuote)
    console.log(quoteResult.quotes.zeroex !== null, '0x')
    console.log(quoteResult.quotes.flashmint !== null, 'fm')
    console.log('---')
    setSelectedQuote(quoteResult?.bestQuote)
  }, [quoteResult])

  useEffect(() => {
    console.log('/////////')
    console.log(quoteResult.bestQuote)
    console.log(
      quoteResult.quotes.flashmint?.fullCostsInUsd,
      'USD',
      quoteResult.quotes.flashmint?.inputOutputTokenAmount.toString(),
      quoteResult.quotes.flashmint?.indexTokenAmount.toString(),
      'flashmint'
    )
    console.log(
      quoteResult.quotes.zeroex?.fullCostsInUsd,
      'USD',
      quoteResult.quotes.zeroex?.inputOutputTokenAmount.toString(),
      quoteResult.quotes.zeroex?.indexTokenAmount.toString(),
      '0x'
    )
    console.log('---')
  }, [quoteResult])

  const onSelectQuoteType = useCallback(
    (type: QuoteType) => {
      console.log(
        'onSelectQuoteType',
        type,
        quoteResult.quotes.flashmint === null,
        quoteResult.quotes.zeroex === null
      )
      if (type === QuoteType.flashmint && quoteResult.quotes.flashmint === null)
        return
      if (type === QuoteType.zeroex && quoteResult.quotes.zeroex === null)
        return
      setSelectedQuote(type)
    },
    [quoteResult]
  )

  const resetTradeData = useCallback(() => {
    setInputTokenAmountFormatted('')
    setSellTokenAmount('0')
  }, [setSellTokenAmount])

  useEffect(() => {
    resetTradeData()
  }, [chainId, resetTradeData])

  const fetchOptions = useCallback(() => {
    if (requiresProtection) return
    fetchQuote({
      isMinting: isBuying,
      inputToken,
      inputTokenAmount: sellTokenAmount,
      inputTokenPrice,
      outputToken,
      outputTokenPrice,
      slippage,
    })
  }, [
    isBuying,
    inputToken,
    inputTokenPrice,
    outputToken,
    outputTokenPrice,
    requiresProtection,
    sellTokenAmount,
    slippage,
  ])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  const onChangeInputTokenAmount = (token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
    }
    setInputTokenAmountFormatted(input || '')
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '')
  }

  const onClickInputBalance = useCallback(() => {
    if (!inputTokenBalance) return
    setInputTokenAmountFormatted(inputTokenBalance)
    setSellTokenAmount(inputTokenBalance)
  }, [inputTokenBalance, setSellTokenAmount])

  const onClickTradeButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (buttonState === TradeButtonState.fetchingError) {
      fetchOptions()
      return
    }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApprovedForSwap && shouldApprove) {
      await onApproveForSwap()
      return
    }

    if (buttonState === TradeButtonState.default) {
      onOpenTransactionReview()
    }
  }, [
    buttonState,
    fetchOptions,
    isApprovedForSwap,
    onApproveForSwap,
    onOpenTransactionReview,
    openConnectModal,
    shouldApprove,
  ])

  const onSwitchTokens = () => {
    toggleIsMinting()
    resetTradeData()
  }

  return (
    <Flex
      background='linear-gradient(33deg, rgba(0, 189, 192, 0.05) -9.23%, rgba(0, 249, 228, 0.05) 48.82%, rgba(212, 0, 216, 0.05) 131.54%), linear-gradient(187deg, #FCFFFF -184.07%, #F7F8F8 171.05%)'
      border='1px solid'
      borderColor={colors.icGray1}
      borderRadius='24px'
      boxShadow='0.5px 1px 2px 0px rgba(44, 51, 51, 0.25), 2px 2px 1px 0px #FCFFFF inset'
      direction='column'
      p='8px 16px 16px'
      height={'100%'}
    >
      <Flex direction={'row'} justify={'space-between'}>
        <Text
          color={colors.icGray4}
          fontSize={'md'}
          fontWeight={500}
          ml={'12px'}
          my={'16px'}
        >
          Swap
        </Text>
        <Settings
          isAuto={isAutoSlippage}
          isDarkMode={false}
          slippage={slippage}
          onChangeSlippage={setSlippage}
          onClickAuto={autoSlippage}
        />
      </Flex>
      <Flex direction='column' m='4px 0 6px'>
        <TradeInputSelector
          config={{ isReadOnly: false }}
          balance={inputTokenBalanceFormatted}
          caption='You pay'
          formattedFiat={''}
          selectedToken={inputToken}
          selectedTokenAmount={inputTokenAmountFormatted}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={onClickInputBalance}
          onSelectToken={() => {
            if (inputTokenslist.length > 1) onOpenSelectInputToken()
          }}
        />
        <Box h='6px' alignSelf={'center'}>
          <IconButton
            background={colors.icWhite}
            margin={'-16px 0 0 0'}
            aria-label='switch input/output tokens'
            color={colors.icGray2}
            icon={<UpDownIcon />}
            onClick={onSwitchTokens}
          />
        </Box>
        <TradeOutput
          config={{
            isInputDisabled: true,
            isSelectorDisabled: false,
            isReadOnly: true,
          }}
          caption={'You receive'}
          selectedToken={outputToken}
          selectedTokenAmount={outputTokenAmountFormatted}
          balance={outputTokenBalanceFormatted}
          formattedFiat={outputTokenAmountUsd}
          priceImpact={
            priceImpactFormatting
              ? {
                  value: priceImpactFormatting.priceImpact,
                  colorCoding: priceImpactFormatting.colorCoding,
                }
              : undefined
          }
          onSelectToken={() => {
            if (outputTokenslist.length > 1) onOpenSelectOutputToken()
          }}
        />
      </Flex>
      <>
        {tradeData.length > 0 && (
          <TradeDetails
            data={tradeData}
            gasPriceInUsd={gasCostsUsd}
            isLoading={isFetchingQuote}
            isToggleDisabled={isToggleDisabled}
            prices={tokenPrices}
            showWarning={showWarning}
            selectedQuoteType={selectedQuote ?? QuoteType.zeroex}
            onToggle={onSelectQuoteType}
          />
        )}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {quoteResult.error?.message ?? 'Error fetching quote'}
          </Text>
        )}
        {!requiresProtection && (
          <TradeButton
            label={buttonLabel}
            isDisabled={isDisabled}
            isLoading={isApprovingForSwap || isFetchingQuote}
            onClick={onClickTradeButton}
          />
        )}
        <Warnings warnings={warnings} />
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
      {transactionReview && (
        <TransactionReviewModal
          isOpen={isTransactionReviewOpen}
          onClose={onCloseTransactionReview}
          transactionReview={transactionReview}
        />
      )}
    </Flex>
  )
}
