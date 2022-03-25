import { useEffect, useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'

import ConnectModal from 'components/header/ConnectModal'
import { POLYGON } from 'constants/chains'
import {
  ExchangeIssuanceLeveragedAddress,
  ExchangeIssuanceZeroExAddress,
  zeroExRouterAddress,
} from 'constants/ethContractAddresses'
import {
  DefiPulseIndex,
  ETH,
  indexNamesMainnet,
  indexNamesPolygon,
  mainnetCurrencyTokens,
  polygonCurrencyTokens,
  Token,
} from 'constants/tokens'
import { useApproval } from 'hooks/useApproval'
import { useBestTradeOption } from 'hooks/useBestTradeOption'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { useTrade } from 'hooks/useTrade'
import { useTradeExchangeIssuance } from 'hooks/useTradeExchangeIssuance'
import { useTradeLeveragedExchangeIssuance } from 'hooks/useTradeLeveragedExchangeIssuance'
import { displayFromWei, toWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { ZeroExData } from 'utils/zeroExUtils'

import QuickTradeSelector from './QuickTradeSelector'
import TradeInfo, { TradeInfoItem } from './TradeInfo'

enum QuickTradeBestOption {
  zeroEx,
  exchangeIssuance,
  leveragedExchangeIssuance,
}

const QuickTrade = (props: {
  isNarrowVersion?: boolean
  singleToken?: Token
}) => {
  const { isDarkMode } = useICColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account, chainId } = useEthers()

  /**
   * Get the list of currency tokens for the selected chain
   * @returns Token[] list of tokens
   */
  const getCurrencyTokensByChain = () => {
    if (chainId === POLYGON.chainId) return polygonCurrencyTokens
    return mainnetCurrencyTokens
  }

  /**
   * Get the list of currency tokens for the selected chain
   * @returns Token[] list of tokens
   */
  const getTokenListByChain = () => {
    const { singleToken } = props
    if (singleToken) return [singleToken]
    if (chainId === POLYGON.chainId) return indexNamesPolygon
    return indexNamesMainnet
  }

  const [bestOption, setBestOption] = useState<QuickTradeBestOption | null>(
    null
  )
  const [hasInsufficientFunds, setHasInsufficientFunds] = useState(false)
  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(DefiPulseIndex)
  // const [buyTokenAmount, setBuyTokenAmount] = useState<string>('0')
  const [buyTokenBalanceFormatted, setBuyTokenBalanceFormatted] = useState('0')
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(
    getTokenListByChain()
  )
  const [sellToken, setSellToken] = useState<Token>(ETH)
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [sellTokenBalanceFormatted, setSellTokenBalanceFormatted] =
    useState('0')
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    getCurrencyTokensByChain()
  )
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])

  // FIXME: remove later, just for testing
  const [tradeInfoDataEI, setTradeInfoDataEI] = useState<TradeInfoItem[]>([])

  const sellTokenBalance = useTokenBalance(sellToken)
  const buyTokenBalance = useTokenBalance(buyToken)

  const { bestOptionResult, isFetchingTradeData, fetchAndCompareOptions } =
    useBestTradeOption()

  const hasFetchingError =
    bestOptionResult && !bestOptionResult.success && !isFetchingTradeData

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    onApprove: onApproveForSwap,
  } = useApproval(sellToken.address, zeroExRouterAddress)
  const {
    isApproved: isApprovedForEIL,
    isApproving: isApprovingForEIL,
    onApprove: onApproveForEIL,
  } = useApproval(sellToken.address, ExchangeIssuanceLeveragedAddress)
  const {
    isApproved: isApprovedForEIZX,
    isApproving: isApprovingForEIZX,
    onApprove: onApproveForEIZX,
  } = useApproval(sellToken.address, ExchangeIssuanceZeroExAddress)

  // TODO: set from best option hook?
  // FIXME: change back to just ` = tradeInfoData[0]?.value ?? '0'` for production
  const buyTokenAmount =
    (bestOption === QuickTradeBestOption.zeroEx
      ? tradeInfoData[0]?.value
      : tradeInfoDataEI[0]?.value) ?? '0'

  const { executeTrade, isTransacting } = useTrade(
    sellToken,
    bestOptionResult?.success ? bestOptionResult.dexData : null
  )
  const { executeEITrade, isTransactingEI } = useTradeExchangeIssuance(
    isBuying,
    sellToken,
    buyToken,
    toWei(buyTokenAmount, buyToken.decimals),
    bestOptionResult?.success ? bestOptionResult.exchangeIssuanceData : null
  )
  const { executeLevEITrade, isTransactingLevEI } =
    useTradeLeveragedExchangeIssuance(
      isBuying,
      sellToken,
      buyToken,
      toWei(buyTokenAmount, buyToken.decimals),
      bestOptionResult?.success
        ? bestOptionResult.leveragedExchangeIssuanceData
        : null
    )

  /**
   * Determine the best trade option.
   */
  useEffect(() => {
    if (bestOptionResult === null || !bestOptionResult.success) {
      setTradeInfoData([])
      return
    }

    const bestOptionIs0x =
      !bestOptionResult.exchangeIssuanceData ||
      toWei(sellTokenAmount, sellToken.decimals).lt(
        bestOptionResult.exchangeIssuanceData.inputTokenAmount
      )
    console.log('0xISBESTOPTION', bestOptionIs0x)

    const buyTokenDecimals = buyToken.decimals

    const dexTradeInfoData = getTradeInfoData0x(
      bestOptionResult.dexData,
      buyTokenDecimals,
      chainId
    )
    setTradeInfoData(dexTradeInfoData)

    const eiTradeInfoData = getTradeInfoDataFromEI(
      bestOptionResult.exchangeIssuanceData,
      sellToken.decimals,
      chainId
    )
    setTradeInfoDataEI(eiTradeInfoData)

    setBestOption(
      bestOptionIs0x
        ? QuickTradeBestOption.zeroEx
        : QuickTradeBestOption.exchangeIssuance
    )
  }, [bestOptionResult])

  /**
   * Switches sell token lists between mainnet and polygon
   */
  useEffect(() => {
    const sellTokenList = getCurrencyTokensByChain()
    const buyTokenList = getTokenListByChain()
    const sellToken = sellTokenList[0]
    const buyToken = buyTokenList[0]
    setSellTokenAmount('0')
    setSellTokenList(sellTokenList)
    setBuyTokenList(buyTokenList)
    setSellToken(sellToken)
    setBuyToken(buyToken)
    setIsBuying(true)
  }, [chainId])

  useEffect(() => {
    const currencyTokensList = getCurrencyTokensByChain()
    const tokenList = getTokenListByChain()
    const sellTokenList = isBuying ? currencyTokensList : tokenList
    const buyTokenList = isBuying ? tokenList : currencyTokensList
    const sellToken = sellTokenList[0]
    const buyToken = buyTokenList[0]
    setSellTokenList(sellTokenList)
    setBuyTokenList(buyTokenList)
    setSellToken(sellToken)
    setBuyToken(buyToken)
  }, [isBuying])

  useEffect(() => {
    const isUSDC = buyToken.symbol === 'USDC'
    const decimals = isUSDC ? 6 : 18
    const formattedBalance = buyTokenBalance
      ? displayFromWei(buyTokenBalance, 2, decimals) || '0.00'
      : '0.00'
    setBuyTokenBalanceFormatted(formattedBalance)
  }, [buyToken, buyTokenBalance])

  useEffect(() => {
    const isUSDC = sellToken.symbol === 'USDC'
    const decimals = isUSDC ? 6 : 18
    const formattedBalance = sellTokenBalance
      ? displayFromWei(sellTokenBalance, 2, decimals) || '0.00'
      : '0.00'
    setSellTokenBalanceFormatted(formattedBalance)
  }, [sellToken, sellTokenBalance])

  useEffect(() => {
    const sellAmount = toWei(sellTokenAmount, sellToken.decimals)

    if (
      bestOption === null ||
      sellAmount.isZero() ||
      sellAmount.isNegative() ||
      sellTokenBalance === undefined
    )
      return

    const hasInsufficientFunds = sellAmount.gt(sellTokenBalance)
    setHasInsufficientFunds(hasInsufficientFunds)
  }, [
    bestOption,
    sellTokenAmount,
    sellToken,
    buyToken,
    buyTokenAmount,
    sellTokenBalance,
  ])

  useEffect(() => {
    fetchOptions()
  }, [buyToken, buyTokenAmount, sellToken, sellTokenAmount])

  const fetchOptions = () => {
    // Right now we only allow setting the sell amount, so no need to check
    // buy token amount here
    const sellTokenInWei = toWei(sellTokenAmount, sellToken.decimals)
    if (sellTokenInWei.isZero() || sellTokenInWei.isNegative()) return
    fetchAndCompareOptions(
      sellToken,
      sellTokenAmount,
      buyToken,
      buyTokenAmount,
      isBuying
    )
  }

  const getIsApproved = () => {
    switch (bestOption) {
      case QuickTradeBestOption.exchangeIssuance:
        return isApprovedForEIZX
      case QuickTradeBestOption.leveragedExchangeIssuance:
        return isApprovedForEIL
      default:
        return isApprovedForSwap
    }
  }

  const getIsApproving = () => {
    switch (bestOption) {
      case QuickTradeBestOption.exchangeIssuance:
        return isApprovingForEIZX
      case QuickTradeBestOption.leveragedExchangeIssuance:
        return isApprovingForEIL
      default:
        return isApprovingForSwap
    }
  }

  const getOnApprove = () => {
    switch (bestOption) {
      case QuickTradeBestOption.exchangeIssuance:
        return onApproveForEIZX()
      case QuickTradeBestOption.leveragedExchangeIssuance:
        return onApproveForEIL()
      default:
        return onApproveForSwap()
    }
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  const getTradeButtonLabel = () => {
    if (!account) {
      return 'Connect Wallet'
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

    const isNativeToken =
      sellToken.symbol === 'ETH' || sellToken.symbol === 'MATIC'

    if (!isNativeToken && getIsApproving()) {
      return 'Approving...'
    }

    if (!isNativeToken && !getIsApproved()) {
      return 'Approve Tokens'
    }

    if (isTransacting || isTransactingEI || isTransactingLevEI)
      return 'Trading...'

    return 'Trade'
  }

  const onChangeSellTokenAmount = (input: string) => {
    const inputNumber = Number(input)
    if (input === sellTokenAmount || input.slice(-1) === '.') return
    if (isNaN(inputNumber) || inputNumber < 0) return
    setSellTokenAmount(inputNumber.toString())
  }

  const onChangeSellToken = (symbol: string) => {
    const filteredList = sellTokenList.filter(
      (token) => token.symbol === symbol
    )
    if (filteredList.length < 0) {
      return
    }
    setSellToken(filteredList[0])
  }

  const onChangeBuyToken = (symbol: string) => {
    const filteredList = buyTokenList.filter((token) => token.symbol === symbol)
    if (filteredList.length < 0) {
      return
    }
    setBuyToken(filteredList[0])
  }

  const onChangeBuyTokenAmount = (input: string) => {
    // const inputNumber = Number(input)
    // if (input === buyTokenAmount || input.slice(-1) === '.') return
    // if (isNaN(inputNumber) || inputNumber < 0) return
    // setBuyTokenAmount(inputNumber.toString())
  }

  const onClickTradeButton = async () => {
    if (!account) {
      // Open connect wallet modal
      onOpen()
      return
    }

    if (hasInsufficientFunds) return

    if (hasFetchingError) {
      fetchOptions()
      return
    }

    const isNativeToken =
      sellToken.symbol === 'ETH' || sellToken.symbol === 'MATIC'
    if (!getIsApproved() && !isNativeToken) {
      await getOnApprove()
      return
    }

    switch (bestOption) {
      case QuickTradeBestOption.zeroEx:
        await executeTrade()
        break
      case QuickTradeBestOption.exchangeIssuance:
        await executeEITrade()
        break
      case QuickTradeBestOption.leveragedExchangeIssuance:
        await executeLevEITrade()
        break
      default:
      // Nothing
    }
  }

  const onSwapTokenLists = () => {
    // It's only necessary to change isBuying - since effect hooks
    // will do the rest listening to this change
    setIsBuying(!isBuying)
  }

  const isLoading = getIsApproving() || isFetchingTradeData

  const getButtonDisabledState = () => {
    if (!account) return false
    if (hasFetchingError) return false
    return (
      buyTokenAmount === '0' ||
      hasInsufficientFunds ||
      isTransacting ||
      isTransactingEI ||
      isTransactingLevEI
    )
  }

  const buttonLabel = getTradeButtonLabel()
  const isButtonDisabled = getButtonDisabledState()

  const isNarrow = props.isNarrowVersion ?? false
  const paddingX = isNarrow ? '16px' : '40px'

  return (
    <Flex
      border='2px solid #F7F1E4'
      borderColor={isDarkMode ? colors.icWhite : colors.black}
      borderRadius='16px'
      direction='column'
      py='20px'
      px={['16px', paddingX]}
    >
      <Flex>
        <Text fontSize='24px' fontWeight='700'>
          Quick Trade
        </Text>
      </Flex>
      <Flex direction='column' my='20px'>
        <QuickTradeSelector
          title='From'
          config={{
            isDarkMode,
            isInputDisabled: false,
            isSelectorDisabled: false,
            isReadOnly: false,
          }}
          selectedToken={sellToken}
          tokenList={sellTokenList}
          selectedTokenBalance={sellTokenBalanceFormatted}
          onChangeInput={onChangeSellTokenAmount}
          onSelectedToken={onChangeSellToken}
        />
        <Box h='12px' alignSelf={'flex-end'}>
          <IconButton
            background='transparent'
            margin={'6px 0'}
            aria-label='Search database'
            borderColor={isDarkMode ? colors.icWhite : colors.black}
            color={isDarkMode ? colors.icWhite : colors.black}
            icon={<UpDownIcon />}
            onClick={onSwapTokenLists}
          />
        </Box>
        <QuickTradeSelector
          title='To'
          config={{
            isDarkMode,
            isInputDisabled: true,
            isSelectorDisabled: false,
            isReadOnly: true,
          }}
          selectedToken={buyToken}
          selectedTokenAmount={buyTokenAmount}
          selectedTokenBalance={buyTokenBalanceFormatted}
          tokenList={buyTokenList}
          onChangeInput={onChangeBuyTokenAmount}
          onSelectedToken={onChangeBuyToken}
        />
      </Flex>
      <Flex direction='column'>
        {tradeInfoData.length > 0 && <TradeInfo data={tradeInfoData} />}
        {tradeInfoDataEI.length > 0 && <TradeInfo data={tradeInfoDataEI} />}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            Error fetching a quote.
          </Text>
        )}
        <TradeButton
          label={buttonLabel}
          background={isDarkMode ? colors.icWhite : colors.icYellow}
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
          onClick={onClickTradeButton}
        />
      </Flex>
      <ConnectModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

interface TradeButtonProps {
  label: string
  background: string
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
}

const TradeButton = (props: TradeButtonProps) => (
  <Button
    background={props.background}
    border='0'
    borderRadius='12px'
    color='#000'
    disabled={props.isDisabled}
    fontSize='24px'
    fontWeight='600'
    isLoading={props.isLoading}
    height='54px'
    w='100%'
    onClick={props.onClick}
  >
    {props.label}
  </Button>
)

function getTradeInfoDataFromEI(
  data: ExchangeIssuanceQuote | null | undefined,
  tokenDecimals: number,
  chainId: ChainId = ChainId.Mainnet
): TradeInfoItem[] {
  if (data === undefined || data === null) return []
  // TODO: fix to show minium receive not input token amount!
  const minReceive =
    displayFromWei(data.inputTokenAmount, undefined, tokenDecimals) ?? '0.0'
  // TODO:
  const networkFee = ''
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'
  const offeredFrom = 'Index - Exchange Issuance'
  return [
    { title: 'Minimum Receive', value: minReceive },
    { title: 'Network Fee', value: `${networkFee} ${networkToken}` },
    { title: 'Offered From', value: offeredFrom },
  ]
}

function getTradeInfoData0x(
  zeroExTradeData: ZeroExData | undefined | null,
  tokenDecimals: number,
  chainId: ChainId = ChainId.Mainnet
): TradeInfoItem[] {
  if (zeroExTradeData === undefined || zeroExTradeData === null) return []

  const { gas, gasPrice, sources } = zeroExTradeData
  if (gasPrice === undefined || gas === undefined || sources === undefined)
    return []

  const minReceive =
    displayFromWei(zeroExTradeData.minOutput, undefined, tokenDecimals) ?? '0.0'

  const networkFee =
    displayFromWei(BigNumber.from(gasPrice).mul(BigNumber.from(gas))) ?? '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'

  const offeredFromSources = zeroExTradeData.sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  return [
    { title: 'Minimum Receive', value: minReceive },
    { title: 'Network Fee', value: `${networkFee} ${networkToken}` },
    { title: 'Offered From', value: offeredFromSources.toString() },
  ]
}

export default QuickTrade
