import { useEffect, useState } from 'react'

import { colors } from 'styles/colors'

import { Flex, Input, Select, Spacer, Text } from '@chakra-ui/react'
import { useEtherBalance, useEthers } from '@usedapp/core'

import { ETH, Token } from 'constants/tokens'
import { useFormattedBalance } from 'hooks/useFormattedBalance'
import { displayFromWei } from 'utils'

interface InputSelectorConfig {
  isDarkMode: boolean
  isDisabled: boolean
  isReadOnly?: boolean
}

const QuickTradeSelector = (props: {
  title: string
  config: InputSelectorConfig
  selectedToken: Token
  tokenList: Token[]
  onChange: (symbol: string) => void
}) => {
  const { config } = props
  const { chainId, account } = useEthers()
  // TODO: Make balance real
  const [balance, setBalance] = useState<string>('0')
  const etherBalance = displayFromWei(useEtherBalance(account), 2, 18) || '0.00'
  const balanceString = useFormattedBalance(props.selectedToken)

  useEffect(() => {
    console.log('balanceString', props.selectedToken.symbol, balanceString)
    if (props.selectedToken.symbol === ETH.symbol) {
      setBalance(etherBalance)
    } else {
      setBalance(balanceString)
    }
    console.log(props.selectedToken.symbol, balance)
  }, [chainId])

  const borderColor = config.isDarkMode ? colors.icWhite : colors.black
  const borderRadius = 16

  return (
    <Flex direction='column'>
      <Text fontSize='20px' fontWeight='700'>
        {props.title}
      </Text>
      <Flex mt='10px' h='54px'>
        <Flex
          align='center'
          justify='center'
          grow='1'
          border='1px solid #000'
          borderColor={borderColor}
          borderLeftRadius={borderRadius}
          px='40px'
        >
          <Input
            placeholder='0'
            type='number'
            variant='unstyled'
            disabled={config.isDisabled}
            isReadOnly={config.isReadOnly ?? false}
          />
          <Spacer />
          <Text align='right' fontSize='12px' fontWeight='400' w='100%'>
            Balance: {balance}
          </Text>
        </Flex>
        <Flex
          align='center'
          h='54px'
          border='1px solid #000'
          borderColor={borderColor}
          borderRightRadius={borderRadius}
          minWidth='100px'
        >
          <Select
            border='0'
            disabled={config.isDisabled}
            w='100px'
            minWidth='100px'
            h='54px'
            onChange={(event) => {
              console.log('event', event.target.value, balanceString)
              props.onChange(event.target.value)
            }}
          >
            {props.tokenList.map((token) => {
              return (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              )
            })}
          </Select>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default QuickTradeSelector
