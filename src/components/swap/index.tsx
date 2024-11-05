import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { OnrampModal } from '@/components/onramp'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SwapNavigation } from '@/components/swap/components/navigation'
import { ARBITRUM, MAINNET } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { useBestQuote } from '@/lib/hooks/use-best-quote'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useNetwork, useSupportedNetworks } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useProtection } from '@/lib/providers/protection'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'
import { useSlippage } from '@/lib/providers/slippage'
import { colors } from '@/lib/styles/colors'
import { isValidTokenInput } from '@/lib/utils'
import { selectSlippage } from '@/lib/utils/slippage'
import { getTokenBySymbol, isTokenPairTradable } from '@/lib/utils/tokens'

import { SelectTokenModal } from './components/select-token-modal'
import { TradeDetails } from './components/trade-details'
import { TradeInputSelector } from './components/trade-input-selector'
import { TradeOutput } from './components/trade-output'
import { TransactionReviewModal } from './components/transaction-review'
import { useSwap } from './hooks/use-swap'
import { useTokenlists } from './hooks/use-tokenlists'
import { useTransactionReviewModal } from './hooks/use-transaction-review-modal'

type SwapProps = {
  isBuying: boolean
  inputToken: Token
  outputToken: Token
}

export const Swap = (props: SwapProps) => {
  const { inputToken, isBuying, outputToken } = props
  const isSupportedNetwork = useSupportedNetworks([
    MAINNET.chainId,
    ARBITRUM.chainId,
  ])
  const { logEvent } = useAnalytics()
  const requiresProtection = useProtection()
  const { chainId } = useNetwork()
  const { slippage } = useSlippage()
  const { address } = useWallet()

  const isTradablePair = useMemo(
    () =>
      isTokenPairTradable(
        requiresProtection,
        inputToken.symbol,
        outputToken.symbol,
        chainId ?? 1,
      ),
    [chainId, requiresProtection, inputToken, outputToken],
  )

  const {
    isOpen: isBuyModalOpen,
    onOpen: onOpenBuyModal,
    onClose: onCloseBuyModal,
  } = useDisclosure()
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
    isFetchingAnyQuote,
    isFetching0x,
    isFetchingFlashmint,
    isFetchingRedemption,
    quoteResults,
  } = useBestQuote(isBuying, inputToken, outputToken)

  const hasFetchingError = false // quoteResults.error !== null && !isFetchingAnyQuote

  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null)
  const [sellTokenAmount, setSellTokenAmount] = useDebounce('0', 300)

  const { selectInputToken, selectOutputToken, toggleIsMinting } =
    useSelectedToken()
  const { inputTokenslist, outputTokenslist } = useTokenlists(
    chainId ?? 1,
    isBuying,
    inputToken,
    outputToken,
  )
  const { transactionReview } = useTransactionReviewModal(
    quoteResults,
    selectedQuote,
    isFetchingAnyQuote,
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
    isFetchingRedemption,
  )

  useEffect(() => {
    setSelectedQuote(quoteResults?.bestQuote)
  }, [quoteResults])

  const resetTradeData = useCallback(() => {
    setInputTokenAmountFormatted('')
    setSellTokenAmount('0')
  }, [setSellTokenAmount])

  useEffect(() => {
    resetTradeData()
  }, [chainId, resetTradeData])

  const fetchOptions = useCallback(() => {
    if (!isTradablePair) return
    const indexSymbol = isBuying ? outputToken.symbol : inputToken.symbol
    const inputOutputTokenSymbol = isBuying
      ? inputToken.symbol
      : outputToken.symbol
    fetchQuote({
      isMinting: isBuying,
      inputToken,
      inputTokenAmount: sellTokenAmount,
      outputToken,
      slippage: selectSlippage(slippage, indexSymbol, inputOutputTokenSymbol),
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

  const onChangeInputTokenAmount = (token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
    }
    setInputTokenAmountFormatted(input || '')
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '')
  }

  const onClickBuyButton = () => {
    onOpenBuyModal()
    logEvent('Buy Onramp CTA Clicked')
  }

  const onClickInputBalance = useCallback(() => {
    if (!inputTokenBalance) return
    setInputTokenAmountFormatted(inputTokenBalance)
    setSellTokenAmount(inputTokenBalance)
  }, [inputTokenBalance, setSellTokenAmount])

  const onSwitchTokens = () => {
    toggleIsMinting()
    resetTradeData()
  }

  return (
    <Flex
      background='linear-gradient(33deg, rgba(0, 189, 192, 0.05) -9.23%, rgba(0, 249, 228, 0.05) 48.82%, rgba(212, 0, 216, 0.05) 131.54%), linear-gradient(187deg, #FCFFFF -184.07%, #F7F8F8 171.05%)'
      border='1px solid'
      borderColor={colors.ic.gray[100]}
      borderRadius='24px'
      boxShadow='0.5px 1px 2px 0px rgba(44, 51, 51, 0.25), 2px 2px 1px 0px #FCFFFF inset'
      direction='column'
      p='8px 16px 16px'
      height={'100%'}
    >
      <SwapNavigation onClickBuy={onClickBuyButton} />
      <Flex direction='column' m='4px 0 6px'>
        <TradeInputSelector
          config={{ isReadOnly: false }}
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
        <Box h='6px' alignSelf={'center'}>
          <IconButton
            className='bg-ic-white text-ic-gray-400'
            margin={'-16px 0 0 0'}
            aria-label='switch input/output tokens'
            icon={<UpDownIcon />}
            onClick={onSwitchTokens}
          />
        </Box>
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
      </Flex>
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
          <Text align='center' color={colors.ic.red} p='16px'>
            {'Error fetching quote'}
          </Text>
        )}
        <SmartTradeButton
          contract={contract ?? ''}
          hasFetchingError={hasFetchingError}
          hasInsufficientFunds={hasInsufficientFunds}
          inputTokenAmount={inputTokenAmountWei.toBigInt()}
          inputToken={inputToken}
          inputValue={sellTokenAmount}
          isFetchingQuote={isFetchingAnyQuote}
          isSupportedNetwork={isSupportedNetwork}
          outputToken={outputToken}
          buttonLabelOverrides={{}}
          onOpenTransactionReview={onOpenTransactionReview}
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
      <OnrampModal isOpen={isBuyModalOpen} onClose={onCloseBuyModal} />
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
