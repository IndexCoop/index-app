import { useEffect, useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import ConnectModal from 'components/header/ConnectModal'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  ExchangeIssuanceLeveragedMainnetAddress,
  ExchangeIssuanceLeveragedPolygonAddress,
  ExchangeIssuanceZeroExMainnetAddress,
  ExchangeIssuanceZeroExPolygonAddress,
  zeroExRouterAddress,
} from 'constants/ethContractAddresses'
import {
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  Token,
} from 'constants/tokens'
import { useApproval } from 'hooks/useApproval'
import { useBalance } from 'hooks/useBalance'
import { maxPriceImpact, useBestTradeOption } from 'hooks/useBestTradeOption'
import { useTrade } from 'hooks/useTrade'
import { useTradeExchangeIssuance } from 'hooks/useTradeExchangeIssuance'
import { useTradeLeveragedExchangeIssuance } from 'hooks/useTradeLeveragedExchangeIssuance'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { isSupportedNetwork, isValidTokenInput, toWei } from 'utils'

import {
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedPriceImpact,
  getHasInsufficientFunds,
  getTradeInfoData0x,
  getTradeInfoDataFromEI,
} from './QuickTradeFormatter'
import QuickTradeSelector from './QuickTradeSelector'
import { getSelectTokenListItems, SelectTokenModal } from './SelectTokenModal'
import { TradeButton } from './TradeButton'
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
  const { account, chainId } = useEthers()

  const supportedNetwork = isSupportedNetwork(chainId ?? -1)

  const {
    isBuying,
    buyToken,
    buyTokenList,
    buyTokenPrice,
    sellToken,
    sellTokenList,
    sellTokenPrice,
    changeBuyToken,
    changeSellToken,
    swapTokenLists,
  } = useTradeTokenLists(chainId, props.singleToken)
  const { getBalance } = useBalance()

  const [bestOption, setBestOption] = useState<QuickTradeBestOption | null>(
    null
  )
  const [buyTokenAmountFormatted, setBuyTokenAmountFormatted] = useState('0.0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])

  const { bestOptionResult, isFetchingTradeData, fetchAndCompareOptions } =
    useBestTradeOption()

  const hasFetchingError =
    bestOptionResult && !bestOptionResult.success && !isFetchingTradeData

  const spenderAddress0x =
    chainId === POLYGON.chainId
      ? ExchangeIssuanceZeroExMainnetAddress
      : ExchangeIssuanceZeroExPolygonAddress
  const spenderAddressLevEIL =
    chainId === POLYGON.chainId
      ? ExchangeIssuanceLeveragedPolygonAddress
      : ExchangeIssuanceLeveragedMainnetAddress

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
  } = useApproval(sellToken, zeroExRouterAddress, sellTokenAmountInWei)
  const {
    isApproved: isApprovedForEIL,
    isApproving: isApprovingForEIL,
    onApprove: onApproveForEIL,
  } = useApproval(sellToken, spenderAddressLevEIL, sellTokenAmountInWei)
  const {
    isApproved: isApprovedForEIZX,
    isApproving: isApprovingForEIZX,
    onApprove: onApproveForEIZX,
  } = useApproval(sellToken, spenderAddress0x, sellTokenAmountInWei)

  const { executeTrade, isTransacting } = useTrade(
    sellToken,
    bestOptionResult?.success ? bestOptionResult.dexData : null
  )
  const { executeEITrade, isTransactingEI } = useTradeExchangeIssuance(
    isBuying,
    sellToken,
    buyToken,
    bestOptionResult?.success ? bestOptionResult.exchangeIssuanceData : null
  )

  const { executeLevEITrade, isTransactingLevEI } =
    useTradeLeveragedExchangeIssuance(
      isBuying,
      sellToken,
      buyToken,
      // TODO: simplify by just passing leveragedExchangeIssuanceData || null
      // TODO: test inside to only exectue trade when data !== null
      bestOptionResult?.success
        ? bestOptionResult.leveragedExchangeIssuanceData?.setTokenAmount ??
            BigNumber.from(0)
        : BigNumber.from(0),
      bestOptionResult?.success
        ? bestOptionResult.leveragedExchangeIssuanceData?.inputTokenAmount ??
            BigNumber.from(0)
        : BigNumber.from(0),
      bestOptionResult?.success
        ? bestOptionResult?.leveragedExchangeIssuanceData
            ?.swapDataDebtCollateral
        : undefined,
      bestOptionResult?.success
        ? bestOptionResult?.leveragedExchangeIssuanceData?.swapDataPaymentToken
        : undefined
    )

  const hasInsufficientFunds = getHasInsufficientFunds(
    bestOption === null,
    sellTokenAmountInWei,
    getBalance(sellToken.symbol)
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
    const gasPriceEI = BigNumber.from(
      bestOptionResult.exchangeIssuanceData?.gasPrice ?? '0'
    )
    const gasPriceLevEI =
      bestOptionResult.leveragedExchangeIssuanceData?.gasPrice ??
      BigNumber.from(0)
    const gasLimit = 1800000 // TODO: Make gasLimit dynamic

    const gas0x = gasPrice0x.mul(gasLimit0x)
    const gasEI = gasPriceEI.mul(gasLimit)
    const gasLevEI = gasPriceLevEI.mul(gasLimit)

    const fullCosts0x = toWei(sellTokenAmount, sellToken.decimals).add(gas0x)
    const fullCostsEI = bestOptionResult.exchangeIssuanceData
      ? bestOptionResult.exchangeIssuanceData.inputTokenAmount.add(gasEI)
      : null
    const fullCostsLevEI = bestOptionResult.leveragedExchangeIssuanceData
      ? bestOptionResult.leveragedExchangeIssuanceData.inputTokenAmount.add(
          gasLevEI
        )
      : null

    const priceImpactDex = parseFloat(
      bestOptionResult?.dexData?.estimatedPriceImpact ?? '5'
    )
    let bestOption = QuickTradeBestOption.zeroEx
    let bestOptionIs0x =
      !fullCostsLevEI ||
      (fullCosts0x.lt(fullCostsLevEI) && priceImpactDex < maxPriceImpact)

    if (bestOptionIs0x) {
      bestOptionIs0x =
        !fullCostsEI ||
        (fullCosts0x.lt(fullCostsEI) && priceImpactDex < maxPriceImpact)
      bestOption = bestOptionIs0x
        ? QuickTradeBestOption.zeroEx
        : QuickTradeBestOption.exchangeIssuance
    } else {
      const bestOptionIsLevEI = !fullCostsEI || fullCostsLevEI!.lt(fullCostsEI)
      bestOption = bestOptionIsLevEI
        ? QuickTradeBestOption.leveragedExchangeIssuance
        : QuickTradeBestOption.exchangeIssuance
    }

    const bestOptionIsLevEI =
      bestOption === QuickTradeBestOption.leveragedExchangeIssuance
    const tradeDataEI = bestOptionIsLevEI
      ? bestOptionResult.leveragedExchangeIssuanceData
      : bestOptionResult.exchangeIssuanceData
    const tradeDataGasPriceEI = bestOptionIsLevEI ? gasPriceLevEI : gasPriceEI
    const tradeDataSetAmountEI = bestOptionIsLevEI
      ? bestOptionResult.leveragedExchangeIssuanceData?.setTokenAmount ??
        BigNumber.from(0)
      : bestOptionResult.exchangeIssuanceData?.setTokenAmount ??
        BigNumber.from(0)

    const tradeInfoData = bestOptionIs0x
      ? getTradeInfoData0x(bestOptionResult.dexData, buyToken, chainId)
      : getTradeInfoDataFromEI(
          tradeDataSetAmountEI,
          tradeDataGasPriceEI,
          buyToken,
          sellToken,
          tradeDataEI,
          chainId,
          isBuying
        )

    const buyTokenAmountFormatted = getFormattedOuputTokenAmount(
      bestOption !== QuickTradeBestOption.zeroEx,
      buyToken.decimals,
      bestOptionResult?.success
        ? bestOptionResult.dexData?.minOutput
        : undefined,
      isBuying ? tradeDataEI?.setTokenAmount : tradeDataEI?.inputTokenAmount
    )

    console.log('BESTOPTION', bestOption)
    setTradeInfoData(tradeInfoData)
    setBestOption(bestOption)
    setBuyTokenAmountFormatted(buyTokenAmountFormatted)
  }, [bestOptionResult])

  useEffect(() => {
    setTradeInfoData([])
  }, [chainId])

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
      sellTokenPrice,
      buyToken,
      // buyTokenAmount,
      buyTokenPrice,
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

  const isNotTradable = (token: Token | undefined) => {
    if (token && chainId === MAINNET.chainId)
      return (
        indexNamesMainnet.filter((t) => t.symbol === token.symbol).length === 0
      )
    if (token && chainId === POLYGON.chainId)
      return (
        indexNamesPolygon.filter((t) => t.symbol === token.symbol).length === 0
      )
    if (token && chainId === OPTIMISM.chainId)
      return (
        indexNamesOptimism.filter((t) => t.symbol === token.symbol).length === 0
      )
    return false
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  const getTradeButtonLabel = () => {
    if (!supportedNetwork) return 'Wrong Network'

    if (!account) {
      return 'Connect Wallet'
    }

    if (isNotTradable(props.singleToken)) {
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

  const onChangeSellTokenAmount = (token: Token, input: string) => {
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '0')
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

  const getButtonDisabledState = () => {
    if (!supportedNetwork) return true
    if (!account) return false
    if (hasFetchingError) return false
    return (
      sellTokenAmount === '0' ||
      hasInsufficientFunds ||
      isTransacting ||
      isTransactingEI ||
      isTransactingLevEI ||
      isNotTradable(props.singleToken)
    )
  }

  const buttonLabel = getTradeButtonLabel()
  const isButtonDisabled = getButtonDisabledState()
  const isLoading = getIsApproving() || isFetchingTradeData

  const isNarrow = props.isNarrowVersion ?? false
  const paddingX = isNarrow ? '16px' : '40px'

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

  return (
    <Flex
      border='2px solid #F7F1E4'
      borderColor={isDarkMode ? colors.icWhite : colors.black}
      borderRadius='16px'
      direction='column'
      py='20px'
      px={['16px', paddingX]}
      height={'100%'}
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
            isInputDisabled: isNotTradable(props.singleToken),
            isNarrowVersion: isNarrow,
            isSelectorDisabled: false,
            isReadOnly: false,
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
          }}
          selectedToken={buyToken}
          selectedTokenAmount={buyTokenAmountFormatted}
          formattedFiat={buyTokenFiat}
          priceImpact={priceImpact ?? undefined}
          tokenList={buyTokenList}
          onChangeInput={(token: Token, input: string) => {}}
          onSelectedToken={(_) => {
            if (outputTokenItems.length > 1) onOpenSelectOutputToken()
          }}
        />
      </Flex>
      <Flex direction='column'>
        {tradeInfoData.length > 0 && <TradeInfo data={tradeInfoData} />}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {bestOptionResult.error.message}
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
    </Flex>
  )
}

export default QuickTrade
