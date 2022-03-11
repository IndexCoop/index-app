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
import {
  ChainId,
  useEtherBalance,
  useEthers,
  useTokenBalance,
} from '@usedapp/core'

import ConnectModal from 'components/header/ConnectModal'
import { MAINNET, POLYGON } from 'constants/chains'
import indexNames, {
  DefiPulseIndex,
  ETH,
  mainnetCurrencyTokens,
  polygonCurrencyTokens,
  Token,
} from 'constants/tokens'
import { displayFromWei, getChainAddress, toWei } from 'utils'
import { useBestTradeOption } from 'utils/bestTradeOption'
import { ZeroExData } from 'utils/zeroExUtils'

import QuickTradeSelector from './QuickTradeSelector'
import TradeInfo, { TradeInfoItem } from './TradeInfo'

enum QuickTradeState {
  default,
  executing,
  loading,
}

const QuickTrade = () => {
  const { isDarkMode } = useICColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account, chainId } = useEthers()

  const [hasInsufficientFunds, setHasInsufficientFunds] = useState(false)
  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(DefiPulseIndex)
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(indexNames)
  const [sellToken, setSellToken] = useState<Token>(ETH)
  const [sellTokenAmount, setSellTokenAmount] = useState<string>('0')
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    chainId === MAINNET.chainId ? mainnetCurrencyTokens : polygonCurrencyTokens
  )

  const etherBalance = useEtherBalance(account)
  const sellTokenBalance = useTokenBalance(
    getChainAddress(sellToken, chainId),
    account
  )

  const { bestTradeOption0xData, isFetchingTradeData } = useBestTradeOption(
    buyToken,
    sellToken,
    sellTokenAmount
  )
  const tradeInfoData: TradeInfoItem[] = getTradeInfoData(
    bestTradeOption0xData,
    chainId
  )
  const buyTokenAmount = tradeInfoData[0]?.value ?? '0'
  const compState = isFetchingTradeData
    ? QuickTradeState.loading
    : QuickTradeState.default

  /**
   * Switches sell token lists between mainnet and polygon
   */
  useEffect(() => {
    if (chainId === MAINNET.chainId) {
      setBuyTokenList(indexNames)
      setSellTokenList(mainnetCurrencyTokens)
    } else {
      setBuyTokenList(indexNames)
      setSellTokenList(polygonCurrencyTokens)
    }
  }, [chainId])

  useEffect(() => {
    if (isBuying) {
      setSellTokenList(getCurrencyTokensByChain())
      setBuyTokenList(indexNames)
    } else {
      setSellTokenList(indexNames)
      setBuyTokenList(getCurrencyTokensByChain())
    }
  }, [isBuying])

  useEffect(() => {
    const sellAmount = toWei(sellTokenAmount)
    const sellBalance =
      sellToken.symbol === 'ETH' ? etherBalance : sellTokenBalance

    if (
      sellAmount.isZero() ||
      sellAmount.isNegative() ||
      sellBalance === undefined
    )
      return
    const hasInsufficientFunds = sellAmount.gt(sellBalance)
    setHasInsufficientFunds(hasInsufficientFunds)
  }, [sellTokenAmount, sellToken, etherBalance, sellTokenBalance])

  /**
   * Get the list of currency tokens for the selected chain
   * @returns Token[] list of tokens
   */
  const getCurrencyTokensByChain = () => {
    if (chainId === POLYGON.chainId) return polygonCurrencyTokens
    return mainnetCurrencyTokens
  }

  /**
   * Sets the list of tokens based on if the user is buying or selling
   */
  const swapTokenLists = () => {
    setBuyToken(sellToken)
    setSellToken(buyToken)
    setIsBuying(!isBuying)
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

  const onClickTradeButton = () => {
    if (!account) {
      // Open connect wallet modal
      onOpen()
      return
    }
    // TODO: trade
  }

  const isDisabled = compState === QuickTradeState.loading
  const isLoading = compState === QuickTradeState.loading

  const buttonLabel = !account
    ? 'Connect Wallet'
    : hasInsufficientFunds
    ? 'Insufficient funds'
    : 'Trade'
  const isButtonDisabled = !account
    ? false
    : buyTokenAmount === '0' || hasInsufficientFunds

  return (
    <Flex
      border='2px solid #F7F1E4'
      borderColor={isDarkMode ? colors.icWhite : colors.black}
      borderRadius='16px'
      direction='column'
      py='20px'
      px={['16px', '40px']}
    >
      <Flex>
        <Text fontSize='24px' fontWeight='700'>
          Quick Trade
        </Text>
      </Flex>
      <Flex direction='column' my='20px'>
        <QuickTradeSelector
          title='From'
          config={{ isDarkMode, isDisabled }}
          selectedToken={sellToken}
          tokenList={sellTokenList}
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
            onClick={swapTokenLists}
          />
        </Box>
        <QuickTradeSelector
          title='To'
          config={{ isDarkMode, isDisabled, isReadOnly: true }}
          selectedToken={buyToken}
          selectedTokenAmount={buyTokenAmount}
          tokenList={buyTokenList}
          onChangeInput={(_) => {}}
          onSelectedToken={onChangeBuyToken}
        />
      </Flex>
      <Flex direction='column'>
        {tradeInfoData.length > 0 && <TradeInfo data={tradeInfoData} />}
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

function getTradeInfoData(
  zeroExTradeData: ZeroExData | undefined | null,
  chainId: ChainId = ChainId.Mainnet
): TradeInfoItem[] {
  if (zeroExTradeData === undefined || zeroExTradeData === null) return []

  const e18 = BigNumber.from(10).pow(18)
  const minReceive =
    displayFromWei(zeroExTradeData.minOutput.div(e18), 10) ?? '-'

  const networkFee =
    displayFromWei(
      BigNumber.from(zeroExTradeData.gasPrice).mul(
        BigNumber.from(zeroExTradeData.gas)
      )
    ) ?? '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'

  const sources = zeroExTradeData.sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  return [
    { title: 'Minimum Receive', value: minReceive },
    { title: 'Network Fee', value: `${networkFee} ${networkToken}` },
    { title: 'Offered From', value: sources.toString() },
  ]
}

export default QuickTrade
