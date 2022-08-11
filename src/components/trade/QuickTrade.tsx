import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'
import { colors, useICColorMode } from 'styles/colors'
import { useNetwork } from 'wagmi'

import { InfoOutlineIcon, UpDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  IconButton,
  Link,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedContractAddress,
  getExchangeIssuanceZeroExContractAddress,
} from '@indexcoop/flash-mint-sdk'

import FlashbotsRpcMessage from 'components/header/FlashbotsRpcMessage'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  zeroExRouterAddress,
  zeroExRouterOptimismAddress,
} from 'constants/ethContractAddresses'
import {
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  Token,
} from 'constants/tokens'
import { useApproval } from 'hooks/useApproval'
import { useBalances } from 'hooks/useBalance'
import { QuoteType, useBestQuote } from 'hooks/useBestQuote'
import { useIsSupportedNetwork } from 'hooks/useIsSupportedNetwork'
import { useSlippage } from 'hooks/useSlippage'
import { useTrade } from 'hooks/useTrade'
import { useTradeExchangeIssuance } from 'hooks/useTradeExchangeIssuance'
import { useTradeLeveragedExchangeIssuance } from 'hooks/useTradeLeveragedExchangeIssuance'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { useWallet } from 'hooks/useWallet'
import { useProtection } from 'providers/Protection/ProtectionProvider'
import { isValidTokenInput, toWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'

import { ContractExecutionView } from './ContractExecutionView'
import {
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedPriceImpact,
  getHasInsufficientFunds,
  getSlippageColorCoding,
  getTradeInfoData0x,
  getTradeInfoDataFromEI,
} from './QuickTradeFormatter'
import QuickTradeSelector from './QuickTradeSelector'
import { getSelectTokenListItems, SelectTokenModal } from './SelectTokenModal'
import { TradeButton } from './TradeButton'
import TradeInfo, { TradeInfoItem } from './TradeInfo'

export enum QuickTradeBestOption {
  zeroEx,
  exchangeIssuance,
  leveragedExchangeIssuance,
}

export type QuickTradeProps = {
  isNarrowVersion?: boolean
  singleToken?: Token
}

const QuickTrade = (props: QuickTradeProps) => {
  const { address } = useWallet()
  const { chain } = useNetwork()
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

  const supportedNetwork = useIsSupportedNetwork(chain?.id ?? -1)

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
  } = useTradeTokenLists(chain?.id, props.singleToken)
  const { getBalance } = useBalances()

  const [bestOption, setBestOption] = useState<QuickTradeBestOption | null>(
    null
  )
  const [buyTokenAmountFormatted, setBuyTokenAmountFormatted] = useState('0.0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])

  const { isFetchingTradeData, fetchAndCompareOptions, quoteResult } =
    useBestQuote()

  const hasFetchingError =
    quoteResult.error !== null && !quoteResult.success && !isFetchingTradeData

  const spenderAddress0x = getExchangeIssuanceZeroExContractAddress(chain?.id)
  const spenderAddressLevEIL = getExchangeIssuanceLeveragedContractAddress(
    chain?.id
  )
  const getZeroExRouterAddress = (chainId: number) => {
    switch (chainId) {
      case OPTIMISM.chainId:
        return zeroExRouterOptimismAddress
      case POLYGON.chainId:
        return zeroExRouterAddress
      default:
        return zeroExRouterAddress
    }
  }
  const zeroExAddress = getZeroExRouterAddress(chain?.id ?? 1)

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

  const { executeTrade, isTransacting } = useTrade()
  const { executeEITrade, isTransactingEI } = useTradeExchangeIssuance()
  const { executeLevEITrade, isTransactingLevEI } =
    useTradeLeveragedExchangeIssuance()

  const hasInsufficientFunds = getHasInsufficientFunds(
    bestOption === null,
    sellTokenAmountInWei,
    getBalance(sellToken.symbol)
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
        return zeroExAddress
    }
  }
  const contractBestOption = getContractForBestOption(bestOption)
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    chain?.id
  )

  const determineBestOption = async () => {
    const quoteNotAvailable =
      quoteResult.bestQuote === QuoteType.notAvailable || !quoteResult.success
    if (quoteNotAvailable) {
      setTradeInfoData([])
      return
    }

    console.log(quoteResult)

    // todo: need this?
    // const inputBalance = getBalance(sellToken.symbol) ?? BigNumber.from(0)
    // let shouldUseEI0x = true
    // const inputTokenAmountEI0x =
    //   bestOptionResult.exchangeIssuanceData?.inputTokenAmount
    // if (inputTokenAmountEI0x && inputTokenAmountEI0x.gt(inputBalance)) {
    //   shouldUseEI0x = false
    // }
    // let shouldUseEILev = true
    // const inputTokenAmountEILev =
    //   bestOptionResult.leveragedExchangeIssuanceData?.inputTokenAmount
    // if (inputTokenAmountEILev && inputTokenAmountEILev.gt(inputBalance)) {
    //   shouldUseEILev = false
    // }

    const bestOption = getBestOptionFromQuoteType(quoteResult.bestQuote)
    const bestOptionIs0x = bestOption === QuickTradeBestOption.zeroEx
    const bestOptionIsLevEI =
      bestOption === QuickTradeBestOption.leveragedExchangeIssuance

    const quoteZeroEx = quoteResult.quotes.zeroEx
    const tradeDataEI = bestOptionIsLevEI
      ? quoteResult.quotes.exchangeIssuanceLeveraged
      : quoteResult.quotes.exchangeIssuanceZeroEx

    const slippageColorCoding = getSlippageColorCoding(slippage, isDarkMode)
    const tradeInfoData = bestOptionIs0x
      ? getTradeInfoData0x(
          buyToken,
          quoteZeroEx?.gasCosts ?? BigNumber.from(0),
          quoteZeroEx?.minOutput ?? BigNumber.from(0),
          quoteZeroEx?.sources ?? [],
          slippage,
          slippageColorCoding,
          chain?.id
        )
      : getTradeInfoDataFromEI(
          tradeDataEI?.setTokenAmount ?? BigNumber.from(0),
          tradeDataEI?.gasPrice ?? BigNumber.from(0),
          tradeDataEI?.gas ?? BigNumber.from(0),
          buyToken,
          sellToken,
          tradeDataEI?.inputOutputTokenAmount ?? BigNumber.from(0),
          slippage,
          slippageColorCoding,
          chain?.id,
          isBuying
        )

    const buyTokenAmountFormatted = getFormattedOuputTokenAmount(
      bestOption !== QuickTradeBestOption.zeroEx,
      buyToken.decimals,
      quoteZeroEx?.minOutput ?? BigNumber.from(0),
      isBuying
        ? tradeDataEI?.setTokenAmount
        : tradeDataEI?.inputOutputTokenAmount
    )

    console.log('BESTOPTION', bestOption)
    setBestOption(bestOption)
    setBuyTokenAmountFormatted(buyTokenAmountFormatted)
    setTradeInfoData(tradeInfoData)
  }

  const resetTradeData = () => {
    setBestOption(null)
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
  }, [chain])

  useEffect(() => {
    fetchOptions()
  }, [buyToken, sellToken, sellTokenAmount])

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
    if (token && chain?.id === MAINNET.chainId)
      return (
        indexNamesMainnet.filter((t) => t.symbol === token.symbol).length === 0
      )
    if (token && chain?.id === POLYGON.chainId)
      return (
        indexNamesPolygon.filter((t) => t.symbol === token.symbol).length === 0
      )
    // if (token && chain?.id === OPTIMISM.chainId)
    //   return (
    //     indexNamesOptimism.filter((t) => t.symbol === token.symbol).length === 0
    //   )
    return false
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  const getTradeButtonLabel = () => {
    if (!address) return 'Connect Wallet'
    if (!supportedNetwork) return 'Wrong Network'

    if (isNotTradable(props.singleToken)) {
      let chainName = 'This Network'
      switch (chain?.id) {
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

    const isNativeToken =
      sellToken.symbol === 'ETH' || sellToken.symbol === 'MATIC'
    if (!getIsApproved() && !isNativeToken) {
      await getOnApprove()
      return
    }
    switch (bestOption) {
      case QuickTradeBestOption.zeroEx:
        await executeTrade(quoteResult.quotes.zeroEx)
        break
      case QuickTradeBestOption.exchangeIssuance:
        await executeEITrade(
          quoteResult.quotes.exchangeIssuanceZeroEx,
          slippage
        )
        break
      case QuickTradeBestOption.leveragedExchangeIssuance:
        await executeLevEITrade(
          quoteResult.quotes.exchangeIssuanceLeveraged,
          slippage
        )
        break
      default:
      // Nothing
    }
  }

  const getButtonDisabledState = () => {
    if (!supportedNetwork) return true
    if (!address) return true
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
    <Box>
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
      <Flex direction='column'>
        {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
        {tradeInfoData.length > 0 && <TradeInfo data={tradeInfoData} />}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {quoteResult.error?.message ?? 'Error fetching quote'}
          </Text>
        )}
        <Flex my='8px'>{chain?.id === 1 && <FlashbotsRpcMessage />}</Flex>
        {!requiresProtection && (
          <TradeButton
            label={buttonLabel}
            background={isDarkMode ? colors.icWhite : colors.icBlue}
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
// TODO: fetching error

const ProtectionWarning = (props: { isDarkMode: boolean }) => {
  const borderColor = props.isDarkMode ? colors.icWhite : colors.black
  return (
    <Flex
      background={colors.icBlue}
      border='1px solid #000'
      borderColor={borderColor}
      borderRadius={10}
      mb={'16px'}
      direction='row'
      textAlign={'center'}
    >
      <Text p={4} justifySelf={'center'} color={colors.black}>
        Not available in your region. Click{' '}
        <Link href='https://indexcoop.com/legal/tokens-restricted-for-us-persons'>
          <Text as='u' color={colors.black}>
            here
          </Text>
        </Link>{' '}
        for more.
        <Tooltip label='Some of our contracts are unavailable to persons or entities who: are citizens of, reside in, located in, incorporated in, or operate a registered office in the U.S.A.'>
          <InfoOutlineIcon
            alignSelf={'flex-end'}
            my={'auto'}
            ml={'18px'}
            color={colors.black}
          />
        </Tooltip>
      </Text>
    </Flex>
  )
}

function getBestOptionFromQuoteType(
  quoteType: QuoteType
): QuickTradeBestOption {
  switch (quoteType) {
    case QuoteType.exchangeIssuanceLeveraged:
      return QuickTradeBestOption.leveragedExchangeIssuance
    case QuoteType.exchangeIssuanceZeroEx:
      return QuickTradeBestOption.exchangeIssuance
    default:
      return QuickTradeBestOption.zeroEx
  }
}

export default QuickTrade
