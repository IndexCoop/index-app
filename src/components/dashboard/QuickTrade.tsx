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
  ExchangeIssuanceLeveragedMainnetAddress,
  ExchangeIssuanceLeveragedPolygonAddress,
  ExchangeIssuanceZeroExAddress,
  zeroExRouterAddress,
} from 'constants/ethContractAddresses'
import {
  DefiPulseIndex,
  ETH,
  icETHIndex,
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
import { displayFromWei, isValidTokenInput, toWei } from 'utils'
import {
  ExchangeIssuanceQuote,
  LeveragedExchangeIssuanceQuote,
} from 'utils/exchangeIssuanceQuotes'
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

  const [icEthErrorMessage, setIcEthErrorMessage] = useState<boolean>(false)

  const sellTokenBalance = useTokenBalance(sellToken)
  const buyTokenBalance = useTokenBalance(buyToken)

  const { bestOptionResult, isFetchingTradeData, fetchAndCompareOptions } =
    useBestTradeOption()

  const hasFetchingError =
    bestOptionResult && !bestOptionResult.success && !isFetchingTradeData

  const spenderAddressLevEIL =
    chainId === ChainId.Polygon
      ? ExchangeIssuanceLeveragedPolygonAddress
      : ExchangeIssuanceLeveragedMainnetAddress

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    onApprove: onApproveForSwap,
  } = useApproval(
    sellToken,
    zeroExRouterAddress,
    toWei(sellTokenAmount, sellToken.decimals)
  )
  const {
    isApproved: isApprovedForEIL,
    isApproving: isApprovingForEIL,
    onApprove: onApproveForEIL,
  } = useApproval(
    sellToken,
    spenderAddressLevEIL,
    toWei(sellTokenAmount, sellToken.decimals)
  )
  const {
    isApproved: isApprovedForEIZX,
    isApproving: isApprovingForEIZX,
    onApprove: onApproveForEIZX,
  } = useApproval(
    sellToken,
    ExchangeIssuanceZeroExAddress,
    toWei(sellTokenAmount, sellToken.decimals)
  )

  const buyTokenAmountFormatted = tradeInfoData[0]?.value ?? '0'

  const { executeTrade, isTransacting } = useTrade(
    sellToken,
    bestOptionResult?.success ? bestOptionResult.dexData : null
  )
  const { executeEITrade, isTransactingEI } = useTradeExchangeIssuance(
    isBuying,
    sellToken,
    buyToken,
    bestOptionResult?.success
      ? bestOptionResult.exchangeIssuanceData?.inputTokenAmount ??
          BigNumber.from(0)
      : BigNumber.from(0),
    bestOptionResult?.success ? bestOptionResult.exchangeIssuanceData : null
  )
  const { executeLevEITrade, isTransactingLevEI } =
    useTradeLeveragedExchangeIssuance(
      isBuying,
      sellToken,
      buyToken,
      bestOptionResult?.success
        ? bestOptionResult.leveragedExchangeIssuanceData?.setTokenAmount ??
            BigNumber.from(0)
        : BigNumber.from(0),
      bestOptionResult?.success
        ? bestOptionResult.leveragedExchangeIssuanceData?.inputTokenAmount ??
            BigNumber.from(0)
        : BigNumber.from(0)
    )

  /**
   * Determine the best trade option.
   */
  useEffect(() => {
    if (bestOptionResult === null || !bestOptionResult.success) {
      setTradeInfoData([])
      return
    }

    const gasLimit0x = BigNumber.from(bestOptionResult.dexData?.gas ?? '0')
    const gasPrice0x = BigNumber.from(bestOptionResult.dexData?.gasPrice ?? '0')
    const gasPriceLevEI =
      bestOptionResult.leveragedExchangeIssuanceData?.gasPrice ??
      BigNumber.from(0)
    const gasLimit = 1800000 // TODO: Make gasLimit dynamic

    const gas0x = gasPrice0x.mul(gasLimit0x)
    const gasLevEI = gasPriceLevEI.mul(gasLimit)

    const fullCosts0x = toWei(sellTokenAmount, sellToken.decimals).add(gas0x)
    const fullCostsLevEI = bestOptionResult.leveragedExchangeIssuanceData
      ? bestOptionResult.leveragedExchangeIssuanceData.inputTokenAmount.add(
          gasLevEI
        )
      : null

    const bestOptionIs0x =
      !fullCostsLevEI ||
      fullCosts0x.lt(
        //NOTE: Change to .gt if you wanna pay up to taste EI
        fullCostsLevEI
      )

    const buyTokenDecimals = buyToken.decimals

    const dexTradeInfoData = bestOptionIs0x
      ? getTradeInfoData0x(bestOptionResult.dexData, buyTokenDecimals, chainId)
      : getTradeInfoDataFromEI(
          bestOptionResult.leveragedExchangeIssuanceData?.setTokenAmount ??
            BigNumber.from(0),
          gasPriceLevEI,
          bestOptionResult.leveragedExchangeIssuanceData,
          isBuying ? buyToken.decimals : sellToken.decimals,
          chainId
        )
    setTradeInfoData(dexTradeInfoData)

    setBestOption(
      bestOptionIs0x
        ? QuickTradeBestOption.zeroEx
        : QuickTradeBestOption.leveragedExchangeIssuance
    )

    // Temporary needed as icETH EI can't provide more than 34 icETH
    const shouldShowicEthErrorMessage =
      !bestOptionIs0x &&
      sellToken.symbol === ETH.symbol &&
      buyToken.symbol === icETHIndex.symbol &&
      toWei(sellTokenAmount, sellToken.decimals).gt(toWei(34))
    setIcEthErrorMessage(shouldShowicEthErrorMessage)
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
  }, [bestOption, buyToken, sellTokenAmount, sellTokenBalance, sellToken])

  useEffect(() => {
    fetchOptions()
  }, [buyToken, sellToken, sellTokenAmount])

  const fetchOptions = () => {
    // Right now we only allow setting the sell amount, so no need to check
    // buy token amount here
    const sellTokenInWei = toWei(sellTokenAmount, sellToken.decimals)
    if (sellTokenInWei.isZero() || sellTokenInWei.isNegative()) return
    fetchAndCompareOptions(
      sellToken,
      sellTokenAmount,
      buyToken,
      // buyTokenAmount,
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

  const onChangeSellTokenAmount = (token: Token) => (input: string) => {
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '0')
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
    const isBuyingNew = !isBuying
    const prevSellToken = sellToken
    const prevBuyToken = buyToken
    const currencyTokensList = getCurrencyTokensByChain()
    const tokenList = getTokenListByChain()
    const sellTokenList = isBuyingNew ? currencyTokensList : tokenList
    const buyTokenList = isBuyingNew ? tokenList : currencyTokensList
    setSellTokenList(sellTokenList)
    setBuyTokenList(buyTokenList)
    setSellToken(prevBuyToken)
    setBuyToken(prevSellToken)
    setIsBuying(isBuyingNew)
  }

  const isLoading = getIsApproving() || isFetchingTradeData

  const getButtonDisabledState = () => {
    if (!account) return false
    if (hasFetchingError) return false
    return (
      sellTokenAmount === '0' ||
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
          onChangeInput={onChangeSellTokenAmount(sellToken)}
          onSelectedToken={onChangeSellToken}
          isNarrowVersion={isNarrow}
        />
        <Box h='12px' alignSelf={'flex-end'} m={'-12px 0 12px 0'}>
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
          selectedTokenAmount={buyTokenAmountFormatted}
          selectedTokenBalance={buyTokenBalanceFormatted}
          tokenList={buyTokenList}
          onChangeInput={onChangeBuyTokenAmount}
          onSelectedToken={onChangeBuyToken}
          isNarrowVersion={isNarrow}
        />
      </Flex>
      <Flex direction='column'>
        {tradeInfoData.length > 0 && <TradeInfo data={tradeInfoData} />}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {bestOptionResult.error.message}
          </Text>
        )}
        {icEthErrorMessage && (
          <Text align='center' color={colors.icYellow} p='16px'>
            You can only issue the displayed amout of icETH at a time (you'll
            pay this amount of ETH, instead of the quantity you want to spend).
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
  setAmount: BigNumber,
  gasPrice: BigNumber,
  data:
    | ExchangeIssuanceQuote
    | LeveragedExchangeIssuanceQuote
    | null
    | undefined,
  tokenDecimals: number,
  chainId: ChainId = ChainId.Mainnet
): TradeInfoItem[] {
  if (data === undefined || data === null) return []
  const exactSetAmount = displayFromWei(setAmount) ?? '0.0'
  const maxPayment =
    displayFromWei(data.inputTokenAmount, undefined, tokenDecimals) ?? '0.0'
  const gasLimit = 1800000 // TODO: Make gasLimit dynamic
  const networkFee = displayFromWei(gasPrice.mul(gasLimit))
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'
  const offeredFrom = 'Index - Exchange Issuance'
  return [
    { title: 'Exact Set amount', value: exactSetAmount },
    { title: 'Maximum payment amount', value: maxPayment },
    { title: 'Network Fee', value: `${networkFeeDisplay} ${networkToken}` },
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

  const buyAmount =
    displayFromWei(
      BigNumber.from(zeroExTradeData.buyAmount),
      undefined,
      tokenDecimals
    ) ?? '0.0'

  const minReceive =
    displayFromWei(zeroExTradeData.minOutput, undefined, tokenDecimals) ?? '0.0'

  const networkFee = displayFromWei(
    BigNumber.from(gasPrice).mul(BigNumber.from(gas))
  )
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'

  const offeredFromSources = zeroExTradeData.sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  return [
    { title: 'Buy Amount', value: buyAmount },
    { title: 'Minimum Received', value: minReceive },
    { title: 'Network Fee', value: `${networkFeeDisplay} ${networkToken}` },
    { title: 'Offered From', value: offeredFromSources.toString() },
  ]
}

export default QuickTrade
