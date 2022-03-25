import { useState } from 'react'

import { colors } from 'styles/colors'

import { Box, Flex, Image, Input, Select, Text } from '@chakra-ui/react'

import { Token } from 'constants/tokens'

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
  selectedTokenBalance?: string
  tokenList: Token[]
  onChangeInput: (input: string) => void
  onSelectedToken: (symbol: string) => void
}) => {
  const [inputString, setInputString] = useState<string>(
    props.selectedTokenAmount || '0.00'
  )
  const { config, selectedToken } = props
  const borderColor = config.isDarkMode ? colors.icWhite : colors.black
  const borderRadius = 16

  const onChangeInput = (amount: string) => {
    if (
      props.onChangeInput === undefined ||
      config.isInputDisabled ||
      config.isSelectorDisabled ||
      config.isReadOnly
    )
      return
    setInputString(amount)
    props.onChangeInput(amount)
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
            placeholder='0.00'
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
          w={['250px', '180px']}
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
          if (props.selectedTokenBalance)
            onChangeInput(props.selectedTokenBalance)
        }}
        cursor='pointer'
      >
        Balance: {props.selectedTokenBalance}
      </Text>
    </Flex>
  )
}

export default QuickTradeSelector
