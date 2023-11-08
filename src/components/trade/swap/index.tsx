import { useCallback, useEffect, useMemo, useState } from 'react'

import { colors, useICColorMode } from '@/lib/styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { useBestQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTrade } from '@/lib/hooks/useTrade'
import { useTradeTokenLists } from '@/lib/hooks/useTradeTokenLists'
import { useBalanceData } from '@/lib/providers/Balances'
import { useProtection } from '@/lib/providers/Protection'
import { useSlippage } from '@/lib/providers/Slippage'
import { isValidTokenInput, toWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'
import { getZeroExRouterAddress } from '@/lib/utils/contracts'
import { getNativeToken } from '@/lib/utils/tokens'

import {
  formattedBalance,
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedPriceImpact,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  getTradeInfoData0x,
  shouldShowWarningSign,
} from '../_shared/QuickTradeFormatter'
import {
  getSelectTokenListItems,
  SelectTokenModal,
} from '../_shared/SelectTokenModal'

import { BetterQuoteState, BetterQuoteView } from './components/BetterQuoteView'
import { ProtectionWarning } from './components/protection-warning'
import { TradeDetails } from './components/trade-details'
import { TradeInfoItem } from './components/trade-details/trade-info'
import { TradeInputSelector } from './components/trade-input-selector'
import { RethSupplyCapOverrides } from '@/components/supply'

import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'
import { useTradeButton } from './hooks/use-trade-button'

export type QuickTradeProps = {
  isNarrowVersion?: boolean
  onOverrideSupplyCap?: (overrides: RethSupplyCapOverrides | undefined) => void
  onShowSupplyCap?: (show: boolean) => void
  switchTabs?: () => void
}

const QuickTrade = (props: QuickTradeProps) => {
  const { openConnectModal } = useConnectModal()
  const { chainId } = useNetwork()
  const { isDarkMode } = useICColorMode()
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

  const requiresProtection = useProtection()

  const { slippage } = useSlippage()
  const {
    isBuying,
    buyToken,
    buyTokenList,
    buyTokenPrice,
    nativeTokenPrice,
    sellToken,
    sellTokenList,
    sellTokenPrice,
    changeBuyToken,
    changeSellToken,
    swapTokenLists,
  } = useTradeTokenLists()
  const { isLoading: isLoadingBalance, getTokenBalance } = useBalanceData()

  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [buyTokenAmountFormatted, setBuyTokenAmountFormatted] = useState('0.0')
  const [inputTokenBalanceFormatted, setInputTokenBalanceFormatted] =
    useState('0.0')
  const [outputTokenBalanceFormatted, setOutputTokenBalanceFormatted] =
    useState('0.0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])
  const [gasCostsInUsd, setGasCostsInUsd] = useState(0)

  const {
    isFetchingZeroEx,
    isFetchingMoreOptions,
    fetchAndCompareOptions,
    quoteResult,
    quoteResultOptions,
  } = useBestQuote()

  const hasFetchingError = quoteResult.error !== null && !isFetchingZeroEx

  const zeroExAddress = getZeroExRouterAddress(chainId)

  const sellTokenAmountInWei = toWei(sellTokenAmount, sellToken.decimals)

  const sellTokenFiat = formattedFiat(
    parseFloat(sellTokenAmount),
    sellTokenPrice
  )
  const buyTokenFiat = formattedFiat(
    parseFloat(buyTokenAmountFormatted),
    buyTokenPrice
  )

  const priceImpact = isFetchingZeroEx
    ? null
    : getFormattedPriceImpact(
        parseFloat(sellTokenAmount),
        sellTokenPrice,
        parseFloat(buyTokenAmountFormatted),
        buyTokenPrice,
        isDarkMode
      )

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(sellToken, zeroExAddress, sellTokenAmountInWei)

  const { executeTrade, isTransacting } = useTrade()

  const hasInsufficientFunds = getHasInsufficientFunds(
    false,
    sellTokenAmountInWei,
    getTokenBalance(sellToken.symbol, chainId)
  )

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === sellToken.symbol
    return !isNativeToken
  }, [chainId, sellToken])

  const buttonState = useTradeButtonState(
    hasFetchingError,
    hasInsufficientFunds,
    shouldApprove,
    isApprovedForSwap,
    isApprovingForSwap,
    isTransacting,
    sellTokenAmount
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  const determineBestOption = async () => {
    if (quoteResult.error !== null) {
      setTradeInfoData([])
      return
    }

    const quoteZeroEx = quoteResult.quotes.zeroEx

    const formattedBuyTokenAmount = getFormattedOuputTokenAmount(
      false,
      buyToken.decimals,
      quoteZeroEx?.minOutput ?? BigNumber.from(0),
      BigNumber.from(0)
    )

    const contractBestOption = getZeroExRouterAddress(chainId)
    const contractBlockExplorerUrl = getBlockExplorerContractUrl(
      contractBestOption,
      chainId
    )

    const gasCostsInUsd = quoteZeroEx?.gasCostsInUsd ?? 0
    setBuyTokenAmountFormatted(formattedBuyTokenAmount)
    const tradeInfoData = getTradeInfoData0x(
      buyToken,
      quoteZeroEx?.gasCosts ?? BigNumber.from(0),
      gasCostsInUsd,
      quoteZeroEx?.minOutput ?? BigNumber.from(0),
      quoteZeroEx?.sources ?? [],
      chainId,
      slippage,
      shouldShowWarningSign(slippage),
      contractBestOption,
      contractBlockExplorerUrl
    )
    setGasCostsInUsd(gasCostsInUsd)
    setTradeInfoData(tradeInfoData)
  }

  const resetTradeData = () => {
    setSellTokenAmount('0')
    setBuyTokenAmountFormatted('0.0')
    setGasCostsInUsd(0)
    setTradeInfoData([])
  }

  /**
   * Determine the best trade option.
   */
  useEffect(() => {
    determineBestOption()
  }, [quoteResult])

  useEffect(() => {
    resetTradeData()
  }, [chainId])

  const fetchOptions = useCallback(() => {
    if (requiresProtection) return
    // Right now we only allow setting the sell amount, so no need to check
    // buy token amount here
    const sellTokenInWei = toWei(sellTokenAmount, sellToken.decimals)
    if (sellTokenInWei.isZero() || sellTokenInWei.isNegative()) return
    fetchAndCompareOptions(
      sellToken,
      sellTokenAmount,
      sellTokenPrice,
      buyToken,
      buyTokenPrice,
      nativeTokenPrice,
      isBuying,
      slippage
    )
  }, [buyToken, sellToken, sellTokenAmount, slippage])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  // Delete: with better quote view
  const onClickBetterQuote = () => {
    if (!quoteResultOptions.hasBetterQuote) return
    if (props.switchTabs) {
      props.switchTabs()
    }
  }

  const onChangeInputTokenAmount = (token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
    }
    setInputTokenAmountFormatted(input || '')
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '')
  }

  const onClickInputBalance = () => {
    if (!inputTokenBalanceFormatted) return
    const fullTokenBalance = formatUnits(
      getTokenBalance(sellToken.symbol, chainId) ?? '0.0',
      sellToken.decimals
    )
    setInputTokenAmountFormatted(fullTokenBalance)
    setSellTokenAmount(fullTokenBalance)
  }

  useEffect(() => {
    if (isLoadingBalance) return
    const tokenBal = getTokenBalance(sellToken.symbol, chainId)
    setInputTokenBalanceFormatted(formattedBalance(sellToken, tokenBal))
  }, [getTokenBalance, sellToken, isLoadingBalance])

  useEffect(() => {
    if (isLoadingBalance) return
    const tokenBal = getTokenBalance(buyToken.symbol, chainId)
    setOutputTokenBalanceFormatted(formattedBalance(buyToken, tokenBal))
  }, [getTokenBalance, buyToken, isLoadingBalance])

  const onClickTradeButton = useCallback(async () => {
    console.log('click', buttonState)
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
      await executeTrade(quoteResult.quotes.zeroEx)
    }
  }, [buttonState])

  const onSwitchTokens = () => {
    swapTokenLists()
    resetTradeData()
  }

  // TradeButtonContainer
  const isLoading = isApprovingForSwap || isFetchingZeroEx
  console.log('isDisabled', isDisabled, buttonState, buttonLabel)

  // SelectTokenModal
  const inputTokenBalances = sellTokenList.map(
    (sellToken) =>
      getTokenBalance(sellToken.symbol, chainId) ?? BigNumber.from(0)
  )
  const outputTokenBalances = buyTokenList.map(
    (buyToken) => getTokenBalance(buyToken.symbol, chainId) ?? BigNumber.from(0)
  )
  const inputTokenItems = getSelectTokenListItems(
    sellTokenList,
    inputTokenBalances,
    chainId
  )
  const outputTokenItems = getSelectTokenListItems(
    buyTokenList,
    outputTokenBalances,
    chainId
  )

  // TradeDetail
  const showWarning = useMemo(() => shouldShowWarningSign(slippage), [slippage])
  const tokenPrices = getFormattedTokenPrices(
    sellToken.symbol,
    sellTokenPrice,
    buyToken.symbol,
    buyTokenPrice
  )

  // Delete: with better quote view
  const betterQuoteState = useMemo(() => {
    if (isFetchingMoreOptions) {
      return BetterQuoteState.fetchingQuote
    }

    if (quoteResultOptions.hasBetterQuote) {
      return quoteResultOptions.isReasonPriceImpact
        ? BetterQuoteState.betterQuotePriceImpact
        : BetterQuoteState.betterQuote
    }

    return BetterQuoteState.noBetterQuote
  }, [
    isFetchingMoreOptions,
    quoteResultOptions.hasBetterQuote,
    quoteResultOptions.isReasonPriceImpact,
  ])

  return (
    <Box>
      <Flex direction='column' m='4px 0 6px'>
        <TradeInputSelector
          config={{ isReadOnly: false }}
          balance={inputTokenBalanceFormatted}
          caption='You pay'
          formattedFiat={sellTokenFiat}
          selectedToken={sellToken}
          selectedTokenAmount={inputTokenAmountFormatted}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={onClickInputBalance}
          onSelectToken={() => {
            if (inputTokenItems.length > 1) onOpenSelectInputToken()
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
        <TradeInputSelector
          config={{
            isInputDisabled: true,
            isSelectorDisabled: false,
            isReadOnly: true,
          }}
          caption={'You receive'}
          selectedToken={buyToken}
          selectedTokenAmount={buyTokenAmountFormatted}
          balance={outputTokenBalanceFormatted}
          formattedFiat={buyTokenFiat}
          priceImpact={
            priceImpact
              ? {
                  value: priceImpact.priceImpact,
                  colorCoding: priceImpact.colorCoding,
                }
              : undefined
          }
          onSelectToken={() => {
            if (outputTokenItems.length > 1) onOpenSelectOutputToken()
          }}
        />
      </Flex>
      <>
        {tradeInfoData.length > 0 && (
          <TradeDetails
            data={tradeInfoData}
            gasPriceInUsd={gasCostsInUsd}
            prices={tokenPrices}
            showWarning={showWarning}
          />
        )}
        {tradeInfoData.length > 0 && (
          <Box my='16px'>
            <BetterQuoteView
              onClick={onClickBetterQuote}
              state={betterQuoteState}
              savingsUsd={quoteResultOptions.savingsUsd}
            />
          </Box>
        )}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {quoteResult.error?.message ?? 'Error fetching quote'}
          </Text>
        )}
        {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
        {!requiresProtection && (
          <TradeButton
            label={buttonLabel}
            isDisabled={isDisabled}
            isLoading={isLoading}
            onClick={onClickTradeButton}
          />
        )}
      </>
      <SelectTokenModal
        isOpen={isSelectInputTokenOpen}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol) => {
          changeSellToken(tokenSymbol)
          onCloseSelectInputToken()
        }}
        items={inputTokenItems}
      />
      <SelectTokenModal
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol) => {
          changeBuyToken(tokenSymbol)
          onCloseSelectOutputToken()
        }}
        items={outputTokenItems}
      />
    </Box>
  )
}

export default QuickTrade
