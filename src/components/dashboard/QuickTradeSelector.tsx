import { useEffect, useState } from 'react'

import { colors } from 'styles/colors'

import { Box, Flex, Image, Input, Select, Spacer, Text } from '@chakra-ui/react'
import { useEtherBalance, useEthers } from '@usedapp/core'

import { ETH, Token } from 'constants/tokens'
import { useFormattedBalance } from 'hooks/useFormattedBalance'
import { useUserBalances } from 'hooks/useUserBalances'
import { displayFromWei } from 'utils'

interface InputSelectorConfig {
  isDarkMode: boolean
  isInputDisabled?: boolean
  isSelectorDisabled?: boolean
  isReadOnly?: boolean
}

const QuickTradeSelector = (props: {
  title: string
  config: InputSelectorConfig
  selectedToken: Token
  selectedTokenAmount?: string
  tokenList: Token[]
  onChangeInput: (input: string) => void
  onSelectedToken: (symbol: string) => void
}) => {
  const { config, selectedToken } = props
  const { chainId, account } = useEthers()
  const userBalances = useUserBalances().userBalances

  const [balance, setBalance] = useState<string>('0')
  const etherBalance = displayFromWei(useEtherBalance(account), 2, 18) || '0.00'
  const balanceString = Number.parseFloat(
    useFormattedBalance(selectedToken)
  ).toFixed(4)

  useEffect(() => {
    if (!account) {
      setBalance('0.00')
      return
    }

    if (selectedToken.symbol === ETH.symbol) {
      setBalance(etherBalance)
    } else {
      setBalance(balanceString)
    }
  }, [account, chainId, selectedToken, etherBalance, balanceString])

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
          grow='2'
          border='1px solid #000'
          borderColor={borderColor}
          borderLeftRadius={borderRadius}
          px={['16px', '30px']}
        >
          <Input
            placeholder='0.00'
            type='number'
            variant='unstyled'
            disabled={config.isInputDisabled ?? false}
            isReadOnly={config.isReadOnly ?? false}
            value={props.selectedTokenAmount}
            onChange={(event) =>
              props.onChangeInput !== undefined
                ? props.onChangeInput(event.target.value)
                : undefined
            }
          />
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
          minWidth={['120px', '150px']}
        >
          <Box pl='10px' pr='0px'>
            <Image
              src={selectedToken.image}
              alt={`${selectedToken.symbol} logo`}
              w='24px'
            />
          </Box>
          <Select
            border='0'
            disabled={config.isSelectorDisabled ?? false}
            w='100%'
            h='54px'
            onChange={(event) => props.onSelectedToken(event.target.value)}
            value={props.selectedToken.symbol}
          >
            {props.tokenList.map((token) => {
              return (
                <option
                  key={token.symbol}
                  value={token.symbol}
                >
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
