import { useEffect, useState } from 'react'

import { BigNumber } from 'set.js'
import { colors } from 'styles/colors'

import { Box, Flex, Image, Input, Select, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { useBalance } from 'hooks/useBalance'
import { isValidTokenInput } from 'utils'

import { formattedBalance } from './QuickTradeFormatter'

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
  onChangeInput: (token: Token, input: string) => void
  onSelectedToken: (symbol: string) => void
  isNarrowVersion: boolean
}) => {
  const { chainId } = useEthers()

  const { getBalance } = useBalance()

  const [inputString, setInputString] = useState<string>(
    props.selectedTokenAmount === '0' ? '' : props.selectedTokenAmount || ''
  )
  const [tokenBalance, setTokenBalance] = useState<string>(
    BigNumber.from(0).toString()
  )

  useEffect(() => {
    setInputString(
      props.selectedTokenAmount === '0' ? '' : props.selectedTokenAmount || ''
    )
  }, [props.selectedTokenAmount])

  useEffect(() => {
    onChangeInput('')
  }, [chainId])

  useEffect(() => {
    const tokenBal = getBalance(props.selectedToken)
    setTokenBalance(formattedBalance(props.selectedToken, tokenBal))
  }, [props.selectedToken, getBalance, chainId])

  const { config, selectedToken } = props
  const borderColor = config.isDarkMode ? colors.icWhite : colors.black
  const borderRadius = 16

  const wideWidths = ['250px', '180px']
  const narrowWidths = ['250px']
  const widths = props.isNarrowVersion ? narrowWidths : wideWidths

  const onChangeInput = (amount: string) => {
    if (!amount) {
      setInputString('')
      props.onChangeInput(props.selectedToken, '')
    }

    if (
      props.onChangeInput === undefined ||
      config.isInputDisabled ||
      config.isSelectorDisabled ||
      config.isReadOnly ||
      !isValidTokenInput(amount, selectedToken.decimals)
    )
      return

    setInputString(amount)
    props.onChangeInput(props.selectedToken, amount)
  }

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
            placeholder='0.0'
            type='number'
            variant='unstyled'
            disabled={config.isInputDisabled ?? false}
            isReadOnly={config.isReadOnly ?? false}
            value={inputString}
            onChange={(event) => onChangeInput(event.target.value)}
          />
        </Flex>
        <Flex
          align='center'
          h='54px'
          border='1px solid #000'
          borderColor={borderColor}
          borderRightRadius={borderRadius}
          w={widths}
        >
          {!props.isNarrowVersion && (
            <Box pl='10px' pr='0px'>
              <Image
                src={selectedToken.image}
                alt={`${selectedToken.symbol} logo`}
                w='24px'
              />
            </Box>
          )}
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
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              )
            })}
          </Select>
        </Flex>
      </Flex>
      <Text
        align='left'
        fontSize='12px'
        fontWeight='400'
        mt='5px'
        onClick={() => {
          if (tokenBalance) onChangeInput(tokenBalance)
        }}
        cursor='pointer'
      >
        Balance: {tokenBalance}
      </Text>
    </Flex>
  )
}

export default QuickTradeSelector
