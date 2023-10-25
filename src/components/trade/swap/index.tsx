import { useCallback, useEffect, useState } from 'react'

import { colors, useICColorMode } from '@/lib/styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { useBestQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTrade } from '@/lib/hooks/useTrade'
import { useTradeTokenLists } from '@/lib/hooks/useTradeTokenLists'
import { useWallet } from '@/lib/hooks/useWallet'
import { useBalanceData } from '@/lib/providers/Balances'
import { useProtection } from '@/lib/providers/Protection'
import { useSlippage } from '@/lib/providers/Slippage'
import { isValidTokenInput, toWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'
import { getZeroExRouterAddress } from '@/lib/utils/contracts'
import { getNativeToken } from '@/lib/utils/tokens'

import { TradeButtonContainer } from '../_shared/footer'
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

import { TradeInputSelector } from '../trade-input-selector'

import { BetterQuoteState, BetterQuoteView } from './BetterQuoteView'
import { TradeDetails } from './trade-details'
import { TradeInfoItem } from './trade-details/trade-info'
import { RethSupplyCapOverrides } from '@/components/supply'

export type QuickTradeProps = {
  isNarrowVersion?: boolean
  onOverrideSupplyCap?: (overrides: RethSupplyCapOverrides | undefined) => void
  onShowSupplyCap?: (show: boolean) => void
  switchTabs?: () => void
}

const QuickTrade = (props: QuickTradeProps) => {
  const { openConnectModal } = useConnectModal()
  const { address } = useWallet()
  const { chainId, isSupportedNetwork } = useNetwork()
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

  const protection = useProtection()

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

  const supportedNetwork = isSupportedNetwork

  const [buttonLabel, setButtonLabel] = useState('')
  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [buyTokenAmountFormatted, setBuyTokenAmountFormatted] = useState('0.0')
  const [inputTokenBalanceFormatted, setInputTokenBalanceFormatted] =
    useState('0.0')
  const [outputTokenBalanceFormatted, setOutputTokenBalanceFormatted] =
    useState('0.0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])
  const [gasCostsInUsd, setGasCostsInUsd] = useState(0)
  const [navData, setNavData] = useState<TradeInfoItem>()

  // Does user need protecting from productive assets?
  const [requiresProtection, setRequiresProtection] = useState(false)

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
      navData,
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

  useEffect(() => {
    if (
      protection.isProtectable &&
      (sellToken.isDangerous || buyToken.isDangerous)
    ) {
      setRequiresProtection(true)
    } else {
      setRequiresProtection(false)
    }
  }, [protection, sellToken, buyToken])

  const getIsApproved = () => {
    return isApprovedForSwap
  }

  const getIsApproving = () => {
    return isApprovingForSwap
  }

  const getOnApprove = () => {
    return onApproveForSwap()
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  useEffect(() => {
    const label = () => {
      if (!address) return 'Connect Wallet'
      if (!supportedNetwork) return 'Wrong Network'

      if (sellTokenAmount === '0') {
        return 'Enter an amount'
      }

      if (hasInsufficientFunds) {
        return 'Insufficient funds'
      }

      if (hasFetchingError) {
        return 'Try again'
      }

      const nativeToken = getNativeToken(chainId)
      const isNativeToken = nativeToken?.symbol === sellToken.symbol
      if (!isNativeToken && getIsApproving()) {
        return 'Approving...'
      }

      if (!isNativeToken && !getIsApproved()) {
        return 'Approve Tokens'
      }

      if (isTransacting) return 'Trading...'

      return 'Trade'
    }
    setButtonLabel(label())
  }, [
    address,
    isSupportedNetwork,
    isTransacting,
    sellToken,
    hasFetchingError,
    hasInsufficientFunds,
    sellTokenAmount,
    chainId,
  ])

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

  const onClickOutputBalance = () => {
    if (!outputTokenBalanceFormatted) return
    const fullTokenBalance = formatUnits(
      getTokenBalance(buyToken.symbol, chainId) ?? '0.0',
      buyToken.decimals
    )
    setBuyTokenAmountFormatted(fullTokenBalance)
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

  const onClickTradeButton = async () => {
    if (!address && openConnectModal) {
      openConnectModal()
      return
    }

    if (hasInsufficientFunds) return

    if (hasFetchingError) {
      fetchOptions()
      return
    }

    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === sellToken.symbol
    if (!getIsApproved() && !isNativeToken) {
      await getOnApprove()
      return
    }

    await executeTrade(quoteResult.quotes.zeroEx)
  }

  const onSwitchTokens = () => {
    swapTokenLists()
    resetTradeData()
  }

  const getButtonDisabledState = () => {
    if (!supportedNetwork) return true
    if (!address) return true
    if (hasFetchingError) return false
    return sellTokenAmount === '0' || hasInsufficientFunds || isTransacting
  }

  const isNarrow = props.isNarrowVersion ?? false

  // TradeButtonContainer
  const isButtonDisabled = getButtonDisabledState()
  const isLoading = getIsApproving() || isFetchingZeroEx

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
  const showWarning = shouldShowWarningSign(slippage)
  const tokenPrices = getFormattedTokenPrices(
    sellToken.symbol,
    sellTokenPrice,
    buyToken.symbol,
    buyTokenPrice
  )

  const getBetterQuoteState = useCallback(() => {
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

  const betterQuoteState = getBetterQuoteState()

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
      <TradeButtonContainer
        indexToken={isBuying ? buyToken : sellToken}
        inputOutputToken={isBuying ? sellToken : buyToken}
        buttonLabel={buttonLabel}
        isButtonDisabled={isButtonDisabled}
        isLoading={isLoading}
        showMevProtectionMessage={false}
        onClickTradeButton={onClickTradeButton}
        contractAddress={null}
        contractExplorerUrl={null}
      >
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
        </>
      </TradeButtonContainer>
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
