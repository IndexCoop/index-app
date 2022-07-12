import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'
import { colors, useICColorMode } from 'styles/colors'

import { InfoOutlineIcon, UpDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  Image,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedContractAddress,
  getExchangeIssuanceZeroExContractAddress,
} from '@indexcoop/index-exchange-issuance-sdk'

import ConnectModal from 'components/header/ConnectModal'
import FlashbotsRpcMessage from 'components/header/FlashbotsRpcMessage'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { zeroExRouterAddress } from 'constants/ethContractAddresses'
import {
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  Token,
  USDC,
} from 'constants/tokens'
import { IssuanceContractAddress } from 'constants/ethContractAddresses'
import { useAccount } from 'hooks/useAccount'
import { useApproval } from 'hooks/useApproval'
import { useBalance } from 'hooks/useBalance'
import { maxPriceImpact, useBestTradeOption } from 'hooks/useBestTradeOption'
import { useNetwork } from 'hooks/useNetwork'
import { useSlippage } from 'hooks/useSlippage'
import { useTrade } from 'hooks/useTrade'
import { useTradeExchangeIssuance } from 'hooks/useTradeExchangeIssuance'
import { useTradeLeveragedExchangeIssuance } from 'hooks/useTradeLeveragedExchangeIssuance'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { useProtection } from 'providers/Protection/ProtectionProvider'
import { isSupportedNetwork, isValidTokenInput, toWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'
import { getFullCostsInUsd } from 'utils/exchangeIssuanceQuotes'
import { GasStation, getGasApiUrl } from 'utils/gasStation'

import { ContractExecutionView } from './ContractExecutionView'
import {
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedPriceImpact,
  getHasInsufficientFunds,
  getSlippageColorCoding,
  getTradeInfoData0x,
  getTradeInfoDataFromEI,
  formattedBalance,
} from './QuickTradeFormatter'
import QuickTradeSelector from './QuickTradeSelector'
import { QuickTradeSettingsPopover } from './QuickTradeSettingsPopover'
import { getSelectTokenListItems, SelectTokenModal } from './SelectTokenModal'
import { TradeButton } from './TradeButton'
import TradeInfo, { TradeInfoItem } from './TradeInfo'
import { useIssuance } from 'hooks/useIssuance'

export enum QuickTradeBestOption {
  zeroEx,
  exchangeIssuance,
  leveragedExchangeIssuance,
}

const QuickTrade = (props: {
  isNarrowVersion?: boolean
  singleToken?: Token
}) => {
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
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

  const protection = useProtection()

  const supportedNetwork = isSupportedNetwork(chainId ?? -1)

  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()

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
  } = useTradeTokenLists(chainId, props.singleToken)
  const { getBalance } = useBalance()

  const [bestOption, setBestOption] = useState<QuickTradeBestOption | null>(
    null
  )
  const [buyTokenAmountFormatted, setBuyTokenAmountFormatted] = useState('0.0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [buyTokenAmount, setBuyTokenAmount] = useState('0')
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])

  const [maxFeePerGas, setMaxFeePerGas] = useState<BigNumber>(BigNumber.from(0))
  const [isToggle, setToggle] = useState(true)
  const [isIssue, setIssue] = useState(true)
  const [estimatedUSDC, setEStimatedUSDC] = useState<BigNumber>(
    BigNumber.from(0)
  )

  const { bestOptionResult, isFetchingTradeData, fetchAndCompareOptions } =
    useBestTradeOption()

  const hasFetchingError =
    bestOptionResult && !bestOptionResult.success && !isFetchingTradeData

  const spenderAddress0x = getExchangeIssuanceZeroExContractAddress(chainId)
  const spenderAddressLevEIL =
    getExchangeIssuanceLeveragedContractAddress(chainId)

  const sellTokenAmountInWei = toWei(sellTokenAmount, sellToken.decimals)
  const buyTokenAmountInWei = toWei(buyTokenAmount, buyToken.decimals)

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
  const {
    isApproved: isApprovedForBye,
    isApproving: isApprovingForBye,
    onApprove: onApproveForBye,
  } = useApproval(
    buyToken,
    IssuanceContractAddress,
    buyTokenAmountInWei.mul(BigNumber.from('2'))
  )
  const {
    isApproved: isAppovedForUSDC,
    isApproving: isApprovingForUSDC,
    onApprove: onApproveForUSDC,
  } = useApproval(
    USDC,
    IssuanceContractAddress,
    estimatedUSDC.mul(BigNumber.from('2'))
  )

  const { handleTrade, isTrading } = useIssuance(
    buyToken,
    buyTokenAmountInWei,
    estimatedUSDC,
    isIssue
  )

  const { executeTrade, isTransacting } = useTrade(
    sellToken,
    bestOptionResult?.success ? bestOptionResult.dexData : null
  )
  const { executeEITrade, isTransactingEI } = useTradeExchangeIssuance(
    isBuying,
    sellToken,
    buyToken,
    slippage,
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
      slippage,
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

  const hasInsufficientUSDC = getHasInsufficientFunds(
    bestOption !== null,
    BigNumber.from(estimatedUSDC),
    getBalance(USDC.symbol)
  )

  const hasInsufficientBye = getHasInsufficientFunds(
    bestOption !== null,
    buyTokenAmountInWei,
    getBalance(buyToken.symbol)
  )

  const getContractForBestOption = (
    bestOption: QuickTradeBestOption | null
  ): string => {
    switch (bestOption) {
      case QuickTradeBestOption.exchangeIssuance:
        return spenderAddress0x
      case QuickTradeBestOption.leveragedExchangeIssuance:
        return spenderAddressLevEIL
      default:
        return zeroExRouterAddress
    }
  }
  const contractBestOption = getContractForBestOption(bestOption)
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    chainId
  )

  const determineBestOption = async () => {
    if (!provider) return

    if (bestOptionResult === null || !bestOptionResult.success) {
      setTradeInfoData([])
      return
    }

    const gasStation = new GasStation(provider)
    const gasPrice = await gasStation.getGasPrice()

    const gasLimit0x = BigNumber.from(bestOptionResult.dexData?.gas ?? '0')
    const gasPrice0x = BigNumber.from(bestOptionResult.dexData?.gasPrice ?? '0')
    const gasLimitEI = BigNumber.from(
      bestOptionResult.exchangeIssuanceData?.gas ?? '0'
    )
    const gasLimitLevEI = BigNumber.from(1800000)

    const gas0x = gasPrice0x.mul(gasLimit0x)
    const gasEI = gasPrice.mul(gasLimitEI)
    const gasLevEI = gasPrice.mul(gasLimitLevEI)

    const inputBalance = getBalance(sellToken.symbol) ?? BigNumber.from(0)
    let shouldUseEI0x = true
    const inputTokenAmountEI0x =
      bestOptionResult.exchangeIssuanceData?.inputTokenAmount
    if (inputTokenAmountEI0x && inputTokenAmountEI0x.gt(inputBalance)) {
      shouldUseEI0x = false
    }
    let shouldUseEILev = true
    const inputTokenAmountEILev =
      bestOptionResult.leveragedExchangeIssuanceData?.inputTokenAmount
    if (inputTokenAmountEILev && inputTokenAmountEILev.gt(inputBalance)) {
      shouldUseEILev = false
    }

    const fullCosts0x = getFullCostsInUsd(
      toWei(sellTokenAmount, sellToken.decimals),
      gas0x,
      sellToken.decimals,
      sellTokenPrice,
      nativeTokenPrice
    )
    const fullCostsEI = shouldUseEI0x
      ? getFullCostsInUsd(
          bestOptionResult.exchangeIssuanceData?.inputTokenAmount,
          gasEI,
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        )
      : null
    const fullCostsLevEI = shouldUseEILev
      ? getFullCostsInUsd(
          bestOptionResult.leveragedExchangeIssuanceData?.inputTokenAmount,
          gasLevEI,
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        )
      : null

    console.log(fullCosts0x, fullCostsEI, fullCostsLevEI, 'FC')

    const priceImpactDex = parseFloat(
      bestOptionResult?.dexData?.estimatedPriceImpact ?? '5'
    )
    const bestOption = getBestTradeOption(
      fullCosts0x,
      fullCostsEI,
      fullCostsLevEI,
      priceImpactDex
    )
    const bestOptionIs0x = bestOption === QuickTradeBestOption.zeroEx
    const bestOptionIsLevEI =
      bestOption === QuickTradeBestOption.leveragedExchangeIssuance

    const tradeDataEI = bestOptionIsLevEI
      ? bestOptionResult.leveragedExchangeIssuanceData
      : bestOptionResult.exchangeIssuanceData
    const tradeDataSetAmountEI = bestOptionIsLevEI
      ? bestOptionResult.leveragedExchangeIssuanceData?.setTokenAmount ??
        BigNumber.from(0)
      : bestOptionResult.exchangeIssuanceData?.setTokenAmount ??
        BigNumber.from(0)

    const slippageColorCoding = getSlippageColorCoding(slippage, isDarkMode)
    const tradeInfoData = bestOptionIs0x
      ? getTradeInfoData0x(
          bestOptionResult.dexData,
          buyToken,
          slippage,
          slippageColorCoding,
          chainId
        )
      : getTradeInfoDataFromEI(
          tradeDataSetAmountEI,
          gasPrice,
          bestOptionIsLevEI ? gasLimitLevEI : gasLimitEI,
          buyToken,
          sellToken,
          tradeDataEI,
          slippage,
          slippageColorCoding,
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
  }

  const resetTradeData = () => {
    setBestOption(null)
    setBuyTokenAmountFormatted('0.0')
    setTradeInfoData([])
    setEStimatedUSDC(BigNumber.from('0'))
  }

  /**
   * Issuance Contract
   */
  const getEstimatedBalance = async () => {
    if (isToggle) return
    const USDCISSUE = BigNumber.from('101781434')
    const USDCREDEEM = BigNumber.from('99556496')
    const buyTokenInWei = toWei(buyTokenAmount, buyToken.decimals)
    const Wei = BigNumber.from('1000000000000000000')
    if (buyTokenInWei.gte(Wei)) {
      if (isIssue) {
        setEStimatedUSDC(USDCISSUE.mul(buyTokenInWei.div(Wei)))
      } else {
        setEStimatedUSDC(USDCREDEEM.mul(buyTokenInWei.div(Wei)))
      }
    } else {
      if (isIssue) {
        setEStimatedUSDC(USDCISSUE.div(Wei.div(buyTokenInWei)))
      } else {
        setEStimatedUSDC(USDCREDEEM.div(Wei.div(buyTokenInWei)))
      }
    }
  }
  /**
   * Determine the best trade option.
   */
  useEffect(() => {
    determineBestOption()
  }, [bestOptionResult])

  useEffect(() => {
    setTradeInfoData([])
  }, [chainId])

  useEffect(() => {
    fetchOptions()
  }, [buyToken, sellToken, sellTokenAmount])

  useEffect(() => {
    getEstimatedBalance()
  }, [buyTokenAmount, isIssue])

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
    const sellTokenInWei = toWei(sellTokenAmount, sellToken.decimals)
    if (sellTokenInWei.isZero() || sellTokenInWei.isNegative()) return
    fetchAndCompareOptions(
      sellToken,
      sellTokenAmount,
      sellTokenPrice,
      buyToken,
      // buyTokenAmount,
      buyTokenPrice,
      isBuying,
      slippage
    )
  }

  const getIsApproved = () => {
    if (isToggle) {
      switch (bestOption) {
        case QuickTradeBestOption.exchangeIssuance:
          return isApprovedForEIZX
        case QuickTradeBestOption.leveragedExchangeIssuance:
          return isApprovedForEIL
        default:
          return isApprovedForSwap
      }
    } else {
      if (isIssue) return isAppovedForUSDC
      return isApprovedForBye
    }
  }

  const getIsApproving = () => {
    if (isToggle) {
      switch (bestOption) {
        case QuickTradeBestOption.exchangeIssuance:
          return isApprovingForEIZX
        case QuickTradeBestOption.leveragedExchangeIssuance:
          return isApprovingForEIL
        default:
          return isApprovingForSwap
      }
    } else {
      if (isIssue) return isApprovingForUSDC
      return isApprovingForBye
    }
  }

  const getOnApprove = () => {
    if (isToggle) {
      switch (bestOption) {
        case QuickTradeBestOption.exchangeIssuance:
          return onApproveForEIZX()
        case QuickTradeBestOption.leveragedExchangeIssuance:
          return onApproveForEIL()
        default:
          return onApproveForSwap()
      }
    } else {
      if (isIssue) return onApproveForUSDC()
      return onApproveForBye()
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

    if (sellTokenAmount === '0' && isToggle) {
      return 'Enter an amount'
    }

    if (buyTokenAmount === '0' && !isToggle) {
      return 'Enter an amount'
    }

    if (hasInsufficientFunds && isToggle) {
      return 'Insufficient funds'
    }

    if (!isToggle && isIssue && hasInsufficientUSDC) {
      return 'Insufficient funds'
    }

    if (!isToggle && !isIssue && hasInsufficientBye) {
      return 'Insufficient funds'
    }

    if (hasFetchingError) {
      return 'Try again'
    }

    if (isToggle) {
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
    } else {
      if (getIsApproving()) {
        return 'Approving...'
      }

      if (!getIsApproved()) {
        return 'Approve Tokens'
      }
      if (isTrading) {
        return 'Trading...'
      }
    }
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

  const onChangeBuyTokenAmount = debounce((token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
      return
    }
    if (!isValidTokenInput(input, token.decimals)) return
    setBuyTokenAmount(input || '0')
  }, 1000)

  const onClickTradeButton = async () => {
    if (!account) {
      // Open connect wallet modal
      onOpen()
      return
    }

    if (hasInsufficientFunds && isToggle) return
    if (!isToggle && isIssue && hasInsufficientUSDC) return
    if (!isToggle && !isIssue && hasInsufficientBye) return

    if (hasFetchingError) {
      fetchOptions()
      return
    }

    const isNativeToken =
      sellToken.symbol === 'ETH' || sellToken.symbol === 'MATIC'
    if (isToggle) {
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
    } else {
      if (!getIsApproved()) {
        await getOnApprove()
        return
      }
      await handleTrade()
    }
  }

  const getButtonDisabledState = () => {
    if (!supportedNetwork) return true
    if (!account) return false
    if (hasFetchingError) return false
    if (isToggle)
      return (
        sellTokenAmount === '0' ||
        hasInsufficientFunds ||
        isTransacting ||
        isTransactingEI ||
        isTransactingLevEI ||
        isNotTradable(props.singleToken)
      )
    else
      return (
        buyTokenAmount === '0' ||
        (isIssue && hasInsufficientUSDC) ||
        (!isIssue && hasInsufficientBye) ||
        isTrading ||
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
      minWidth='380px'
    >
      <Flex align='center' justify='space-between'>
        <Text fontSize='24px' fontWeight='700'>
          Quick Trade
        </Text>
        <QuickTradeSettingsPopover
          isAuto={isAutoSlippage}
          isDarkMode={isDarkMode}
          onChangeSlippage={setSlippage}
          onClickAuto={autoSlippage}
          slippage={slippage}
        />
      </Flex>
      {props.singleToken !== undefined && (
        <>
          {isToggle ? (
            <>
              <Flex
                borderTop='1px solid #F7F1E4'
                borderColor={isDarkMode ? colors.icWhite : colors.black}
                fontSize='14px'
                pt='10px'
                alignItems='center'
                justifyContent='space-between'
              >
                <Text marginRight='12px'>Large Transaction? </Text>
                <Box
                  py='4px'
                  px='12px'
                  border='1px solid  #F7F1E4'
                  borderColor={isDarkMode ? colors.icWhite : colors.black}
                  borderRadius='16px'
                  cursor='pointer'
                  _hover={{
                    backgroundColor: isDarkMode
                      ? colors.icGrayLightMode
                      : colors.icGrayDarkMode,
                  }}
                  onClick={() => setToggle(false)}
                >
                  Toggle Flash Issuance
                </Box>
              </Flex>
            </>
          ) : (
            <>
              <Flex
                borderTop='1px solid #F7F1E4'
                borderColor={isDarkMode ? colors.icWhite : colors.black}
                fontSize='14px'
                py='10px'
                alignItems='center'
                justifyContent='right'
              >
                <Box
                  py='4px'
                  px='12px'
                  border='1px solid  #F7F1E4'
                  borderColor={isDarkMode ? colors.icWhite : colors.black}
                  borderRadius='16px'
                  cursor='pointer'
                  _hover={{
                    backgroundColor: isDarkMode
                      ? colors.icGrayLightMode
                      : colors.icGrayDarkMode,
                  }}
                  onClick={() => setToggle(true)}
                >
                  Toggle Dex Swap
                </Box>
              </Flex>
            </>
          )}
        </>
      )}
      {isToggle ? (
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
            onSelectedToken={(_) => {
              if (outputTokenItems.length > 1) onOpenSelectOutputToken()
            }}
          />
        </Flex>
      ) : (
        <>
          <Flex>
            <Box
              borderTopLeftRadius='16px'
              borderBottomLeftRadius='16px'
              border='1px solid black'
              borderColor={isDarkMode ? colors.icWhite : colors.black}
              padding='8px'
              _hover={{ fontWeight: 700 }}
              cursor='pointer'
              onClick={() => setIssue(true)}
              fontWeight={isIssue ? 700 : 400}
            >
              Flash Issue
            </Box>
            <Box
              borderTopRightRadius='16px'
              borderBottomRightRadius='16px'
              border='1px solid black'
              borderColor={isDarkMode ? colors.icWhite : colors.black}
              padding='8px'
              _hover={{ fontWeight: 700 }}
              cursor='pointer'
              fontWeight={!isIssue ? 700 : 400}
              onClick={() => setIssue(false)}
            >
              Flash Redeem
            </Box>
          </Flex>
          <Box
            borderColor={isDarkMode ? colors.icWhite : colors.black}
            paddingTop='16px'
          >
            <QuickTradeSelector
              title={isIssue ? 'Issue' : 'Redeem'}
              config={{
                isDarkMode,
                isInputDisabled: false,
                isNarrowVersion: isNarrow,
                isSelectorDisabled: false,
                isReadOnly: false,
              }}
              selectedToken={buyToken}
              selectedTokenAmount={buyTokenAmountFormatted}
              formattedFiat=''
              priceImpact={priceImpact ?? undefined}
              tokenList={buyTokenList}
              onChangeInput={onChangeBuyTokenAmount}
              onSelectedToken={(_) => {}}
            />
            <Text marginTop='16px'>
              {isIssue
                ? 'Estimated USDC required for issuance (inc. slippage)'
                : 'Estimated USDC output for redemption (inc. slippage)'}
            </Text>
            <Flex alignItems='center' marginTop='8px'>
              <Image
                src={USDC.image}
                alt={USDC.name + ' logo'}
                w='48px'
                h='48px'
              />
              <Text fontWeight='600' marginLeft='16px'>
                {formattedBalance(USDC, estimatedUSDC, USDC.decimals)}
              </Text>
            </Flex>
            <Text marginTop='8px' fontSize='12px' fontWeight='400'>
              USDC Balance: {formattedBalance(USDC, getBalance(USDC.symbol))}
            </Text>
          </Box>
        </>
      )}

      <Flex direction='column'>
        {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
        {tradeInfoData.length > 0 && <TradeInfo data={tradeInfoData} />}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {bestOptionResult.error.message}
          </Text>
        )}
        <Flex my='8px'>{chainId === 1 && <FlashbotsRpcMessage />}</Flex>
        {!requiresProtection && (
          <TradeButton
            label={buttonLabel}
            background={isDarkMode ? colors.icWhite : colors.icYellow}
            isDisabled={isButtonDisabled}
            isLoading={isLoading}
            onClick={onClickTradeButton}
          />
        )}
        {bestOption !== null && (
          <ContractExecutionView
            blockExplorerUrl={contractBlockExplorerUrl}
            contractAddress={contractBestOption}
            name=''
          />
        )}
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

const ProtectionWarning = (props: { isDarkMode: boolean }) => {
  const borderColor = props.isDarkMode ? colors.icWhite : colors.black
  return (
    <Flex
      background={colors.icYellow}
      border='1px solid #000'
      borderColor={borderColor}
      borderRadius={10}
      mb={'16px'}
      direction='row'
      textAlign={'center'}
    >
      <Spacer flexGrow={3} />
      <Text p={4} justifySelf={'center'} flexGrow={6} color={colors.black}>
        Not available in your region
      </Text>
      <Tooltip label='Some of our contracts are unavailable to persons or entities who: are citizens of, reside in, located in, incorporated in, or operate a registered office in the U.S.A.'>
        <InfoOutlineIcon
          alignSelf={'flex-end'}
          my={'auto'}
          flexGrow={2}
          color={colors.black}
        />
      </Tooltip>
    </Flex>
  )
}

export function getBestTradeOption(
  fullCosts0x: number | null,
  fullCostsEI: number | null,
  fullCostsLevEI: number | null,
  priceImpactDex: number
): QuickTradeBestOption {
  if (fullCostsEI === null && fullCostsLevEI === null) {
    return QuickTradeBestOption.zeroEx
  }

  const quotes: number[][] = []
  if (fullCosts0x) {
    quotes.push([QuickTradeBestOption.zeroEx, fullCosts0x])
  }
  if (fullCostsEI) {
    quotes.push([QuickTradeBestOption.exchangeIssuance, fullCostsEI])
  }
  if (fullCostsLevEI) {
    quotes.push([
      QuickTradeBestOption.leveragedExchangeIssuance,
      fullCostsLevEI,
    ])
  }
  const cheapestQuotes = quotes.sort((q1, q2) => q1[1] - q2[1])

  if (cheapestQuotes.length <= 0) {
    return QuickTradeBestOption.zeroEx
  }

  const cheapestQuote = cheapestQuotes[0]
  const bestOption = cheapestQuote[0]

  // If only one quote, return best option immediately
  if (cheapestQuotes.length === 1) {
    return bestOption
  }

  // If multiple quotes, check price impact of 0x option
  if (
    bestOption === QuickTradeBestOption.zeroEx &&
    priceImpactDex >= maxPriceImpact
  ) {
    // In case price impact is too high, return cheapest exchange issuance
    return cheapestQuotes[1][0]
  }

  return bestOption
}

export default QuickTrade
