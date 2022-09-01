import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'
import { colors, useICColorMode } from 'styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { Token } from 'constants/tokens'
import { useApproval } from 'hooks/useApproval'
import { useBalances } from 'hooks/useBalance'
import { QuoteType, useBestQuote } from 'hooks/useBestQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useTokenComponents } from 'hooks/useTokenComponents'
import { useTrade } from 'hooks/useTrade'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { useWallet } from 'hooks/useWallet'
import { useMarketData } from 'providers/MarketData'
import { useProtection } from 'providers/Protection'
import { useSlippage } from 'providers/Slippage'
import { isValidTokenInput, toWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'
import { getZeroExRouterAddress } from 'utils/contracts'
import { getNativeToken, isNotTradableToken, isPerpToken } from 'utils/tokens'

import {
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedPriceImpact,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  getTradeInfoData0x,
  shouldShowWarningSign,
} from './QuickTradeFormatter'
import QuickTradeSelector from './QuickTradeSelector'
import { getSelectTokenListItems, SelectTokenModal } from './SelectTokenModal'
import { TradeButtonContainer } from './TradeButtonContainer'
import { TradeDetail } from './TradeDetail'
import { TradeInfoItem } from './TradeInfo'

export type QuickTradeProps = {
  isNarrowVersion?: boolean
  singleToken?: Token
}

const QuickTrade = (props: QuickTradeProps) => {
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
  } = useTradeTokenLists(props.singleToken)
  const { getBalance } = useBalances()

  const { selectMarketDataByToken } = useMarketData()

  const supportedNetwork = isSupportedNetwork

  const [buyTokenAmountFormatted, setBuyTokenAmountFormatted] = useState('0.0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])
  const [navData, setNavData] = useState<TradeInfoItem>()

  const navToken = isBuying ? buyToken : sellToken
  const marketData = selectMarketDataByToken(navToken)

  const { nav } = useTokenComponents(
    navToken,
    marketData,
    isPerpToken(navToken)
  )

  useEffect(() => {
    if (tradeInfoData.length < 1) return
    if (nav <= 0) return
    const navTokenAmount = isBuying ? buyTokenAmountFormatted : sellTokenAmount
    const tokenFiat = isBuying
      ? parseFloat(buyTokenAmountFormatted) * buyTokenPrice
      : parseFloat(sellTokenAmount) * sellTokenPrice
    const proRatedMarketPrice = tokenFiat * Number(navTokenAmount)
    const proRatedNavPrice = nav * Number(navTokenAmount)
    const navDivergence =
      (proRatedMarketPrice - proRatedNavPrice) / proRatedMarketPrice / 100
    const navData: TradeInfoItem = {
      title: 'NAV',
      values: [
        proRatedNavPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
      ],
      subValue: '(' + navDivergence.toFixed(2) + '%)',
      tooltip:
        'Net Asset Value (NAV) for an Index Coop token is the net value of the underlying tokens minus the value of the debt taken on (only applicable for leveraged tokens). Sometimes the price of a token will trade at a different value than its NAV',
    }
    const navIndex = 2
    var updatedInfoData = tradeInfoData
    updatedInfoData[navIndex] = navData
    setNavData(navData)
    setTradeInfoData(updatedInfoData)
  }, [nav, buyTokenAmountFormatted, sellTokenAmount])

  const { isFetchingTradeData, fetchAndCompareOptions, quoteResult } =
    useBestQuote()

  const hasFetchingError =
    quoteResult.error !== null && !quoteResult.success && !isFetchingTradeData

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

  const priceImpact = isFetchingTradeData
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
    onApprove: onApproveForSwap,
  } = useApproval(sellToken, zeroExAddress, sellTokenAmountInWei)

  const { executeTrade, isTransacting } = useTrade()

  const hasInsufficientFunds = getHasInsufficientFunds(
    quoteResult.bestQuote === QuoteType.notAvailable || !quoteResult.success,
    sellTokenAmountInWei,
    getBalance(sellToken.symbol)
  )

  const contractBestOption = getZeroExRouterAddress(chainId)
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    chainId
  )

  const determineBestOption = async () => {
    const quoteNotAvailable =
      quoteResult.bestQuote === QuoteType.notAvailable || !quoteResult.success
    if (quoteNotAvailable) {
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

    setBuyTokenAmountFormatted(formattedBuyTokenAmount)
    const tradeInfoData = getTradeInfoData0x(
      buyToken,
      quoteZeroEx?.gasCosts ?? BigNumber.from(0),
      quoteZeroEx?.minOutput ?? BigNumber.from(0),
      quoteZeroEx?.sources ?? [],
      chainId,
      navData,
      slippage,
      shouldShowWarningSign(slippage)
    )
    setTradeInfoData(tradeInfoData)
  }

  const resetTradeData = () => {
    setBuyTokenAmountFormatted('0.0')
    setTradeInfoData([])
  }

  /**
   * Determine the best trade option.
   */
  useEffect(() => {
    determineBestOption()
  }, [quoteResult])

  useEffect(() => {
    setTradeInfoData([])
  }, [chainId])

  useEffect(() => {
    fetchOptions()
  }, [buyToken, sellToken, sellTokenAmount, slippage])

  // Does user need protecting from productive assets?
  const [requiresProtection, setRequiresProtection] = useState(false)
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

  const fetchOptions = () => {
    // Right now we only allow setting the sell amount, so no need to check
    // buy token amount here
    if (requiresProtection) return
    const sellTokenInWei = toWei(sellTokenAmount, sellToken.decimals)
    if (sellTokenInWei.isZero() || sellTokenInWei.isNegative()) return
    fetchAndCompareOptions(
      sellToken,
      sellTokenAmount,
      sellTokenPrice,
      buyToken,
      // buyTokenAmount,
      buyTokenPrice,
      nativeTokenPrice,
      isBuying,
      slippage
    )
  }

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
  const getTradeButtonLabel = () => {
    if (!address) return 'Connect Wallet'
    if (!supportedNetwork) return 'Wrong Network'

    if (isNotTradableToken(props.singleToken, chainId)) {
      let chainName = 'This Network'
      switch (chainId) {
        case MAINNET.chainId:
          chainName = 'Mainnet'
          break
        case POLYGON.chainId:
          chainName = 'Polygon'
          break
        case OPTIMISM.chainId:
          chainName = 'Optimism'
          break
      }

      return `Not Available on ${chainName}`
    }

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

  const onChangeSellTokenAmount = debounce((token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
      return
    }
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '0')
  }, 1000)

  const onClickTradeButton = async () => {
    if (!address) {
      // Open connect wallet modal
      //openConnectModal()
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

  const getButtonDisabledState = () => {
    if (!supportedNetwork) return true
    if (!address) return true
    if (hasFetchingError) return false
    return (
      sellTokenAmount === '0' ||
      hasInsufficientFunds ||
      isTransacting ||
      isNotTradableToken(props.singleToken, chainId)
    )
  }

  const isNarrow = props.isNarrowVersion ?? false

  // TradeButtonContainer
  const buttonLabel = getTradeButtonLabel()
  const isButtonDisabled = getButtonDisabledState()
  const isLoading = getIsApproving() || isFetchingTradeData

  // SelectTokenModal
  const inputTokenBalances = sellTokenList.map(
    (sellToken) => getBalance(sellToken.symbol) ?? BigNumber.from(0)
  )
  const outputTokenBalances = buyTokenList.map(
    (buyToken) => getBalance(buyToken.symbol) ?? BigNumber.from(0)
  )
  const inputTokenItems = getSelectTokenListItems(
    sellTokenList,
    inputTokenBalances
  )
  const outputTokenItems = getSelectTokenListItems(
    buyTokenList,
    outputTokenBalances
  )

  // TradeDetail
  const showWarning = shouldShowWarningSign(slippage)
  const tokenPrices = getFormattedTokenPrices(
    sellToken.symbol,
    sellTokenPrice,
    buyToken.symbol,
    buyTokenPrice
  )

  return (
    <Box>
      <Flex direction='column' my='20px'>
        <QuickTradeSelector
          title='From'
          config={{
            isDarkMode,
            isInputDisabled: isNotTradableToken(props.singleToken, chainId),
            isNarrowVersion: isNarrow,
            isSelectorDisabled: false,
            isReadOnly: false,
            showMaxLabel: true,
          }}
          selectedToken={sellToken}
          formattedFiat={sellTokenFiat}
          tokenList={sellTokenList}
          onChangeInput={onChangeSellTokenAmount}
          onSelectedToken={(_) => {
            if (inputTokenItems.length > 1) onOpenSelectInputToken()
          }}
        />
        <Box h='12px' alignSelf={'flex-end'} m={'-12px 0 12px 0'}>
          <IconButton
            background='transparent'
            margin={'6px 0'}
            aria-label='Search database'
            borderColor={isDarkMode ? colors.icWhite : colors.black}
            color={isDarkMode ? colors.icWhite : colors.black}
            icon={<UpDownIcon />}
            onClick={() => swapTokenLists()}
          />
        </Box>
        <QuickTradeSelector
          title='To'
          config={{
            isDarkMode,
            isInputDisabled: true,
            isNarrowVersion: isNarrow,
            isSelectorDisabled: false,
            isReadOnly: true,
            showMaxLabel: false,
          }}
          selectedToken={buyToken}
          selectedTokenAmount={buyTokenAmountFormatted}
          formattedFiat={buyTokenFiat}
          priceImpact={priceImpact ?? undefined}
          tokenList={buyTokenList}
          onSelectedToken={(_) => {
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
        onClickTradeButton={onClickTradeButton}
        contractAddress={contractBestOption}
        contractExplorerUrl={contractBlockExplorerUrl}
      >
        <>
          {tradeInfoData.length > 0 && (
            <TradeDetail
              data={tradeInfoData}
              prices={tokenPrices}
              showWarning={showWarning}
            />
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
