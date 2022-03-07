import { useEffect, useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import { MAINNET, POLYGON } from 'constants/chains'
import indexNames, {
  DefiPulseIndex,
  ETH,
  mainnetCurrencyTokens,
  polygonCurrencyTokens,
  Token,
} from 'constants/tokens'

import QuickTradeSelector from './QuickTradeSelector'
import TradeInfo, { TradeInfoItem } from './TradeInfo'

enum QuickTradeState {
  default,
  executing,
  loading,
}

const QuickTrade = () => {
  const { isDarkMode } = useICColorMode()
  const { chainId } = useEthers()

  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(DefiPulseIndex)
  const [buyTokenAmount, setBuyTokenAmount] = useState<string>('0')
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(indexNames)
  const [sellToken, setSellToken] = useState<Token>(ETH)
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    chainId === MAINNET.chainId ? mainnetCurrencyTokens : polygonCurrencyTokens
  )
  const [tradeInfoData, setTradeInfoData] = useState<TradeInfoItem[]>([])
  const [compState, setCompState] = useState<QuickTradeState>(
    QuickTradeState.default
  )

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

  /**
   * Get the list of currency tokens for the selected chain
   * @returns {Token[]} list of tokens
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
    console.log(input)
    setCompState(QuickTradeState.loading)
    // TODO: fetch best price/amount
    // TODO: update ui
    setTimeout(() => {
      setCompState(QuickTradeState.default)
      const isZero = input === '0' || input.length < 1
      setBuyTokenAmount(isZero ? '0' : '200')
      setTradeInfoData(
        isZero
          ? []
          : [
              { title: 'Minimum Receive', value: '17.879440' },
              { title: 'Network Fee', value: '0.003672 ETH' },
              { title: 'Offered From', value: 'SushiSwap' },
            ]
      )
    }, 2000)
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

  const isDisabled =
    compState === QuickTradeState.loading ||
    compState === QuickTradeState.executing
  const isLoading = compState === QuickTradeState.loading
  const isButtonDisabled = buyTokenAmount === '0'

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
        <Button
          background={isDarkMode ? colors.icWhite : colors.icYellow}
          border='0'
          borderRadius='12px'
          color='#000'
          disabled={isButtonDisabled}
          fontSize='24px'
          fontWeight='600'
          isLoading={isLoading}
          height='54px'
          w='100%'
        >
          Trade
        </Button>
      </Flex>
    </Flex>
  )
}

export default QuickTrade
