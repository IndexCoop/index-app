import { useEffect, useState } from 'react'

import { colors } from 'styles/colors'

import { Box, Flex, Image, Input, Select, Spacer, Text } from '@chakra-ui/react'
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
  const { config, selectedToken } = props
  const { chainId, account } = useEthers()
  const [balance, setBalance] = useState<string>('0')
  const etherBalance = displayFromWei(useEtherBalance(account), 2, 18) || '0.00'
  const balanceString = useFormattedBalance(selectedToken)

  useEffect(() => {
    if (selectedToken.symbol === ETH.symbol) {
      setBalance(etherBalance)
    } else {
      setBalance(balanceString)
    }
  }, [chainId, selectedToken, etherBalance, balanceString])

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
          minWidth='150px'
        >
          <Box pl='12px' pr='0px'>
            <Image
              src={selectedToken.image}
              alt={`${selectedToken.symbol} logo`}
              w='24px'
            />
          </Box>
          <Select
            border='0'
            disabled={config.isDisabled}
            w='100%'
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
