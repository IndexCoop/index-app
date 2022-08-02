import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { colors, useICColorMode } from 'styles/colors'
import { useNetwork } from 'wagmi'

import { Box, Flex, Image, Input, Text } from '@chakra-ui/react'
import { formatUnits } from '@ethersproject/units'

import { Token } from 'constants/tokens'
import { useBalances } from 'hooks/useBalance'
import { isValidTokenInput } from 'utils'

import { formattedBalance } from './QuickTradeFormatter'

interface InputSelectorConfig {
  isDarkMode: boolean
  isNarrowVersion: boolean
  isInputDisabled?: boolean
  isSelectorDisabled?: boolean
  isReadOnly?: boolean
}

const QuickTradeSelector = (props: {
  title: string
  config: InputSelectorConfig
  selectedToken: Token
  selectedTokenAmount?: string
  priceImpact?: { priceImpact: string; colorCoding: string }
  formattedFiat: string
  tokenList: Token[]
  onChangeInput?: (token: Token, input: string) => void
  onSelectedToken: (symbol: string) => void
}) => {
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
  const { isDarkMode } = useICColorMode()
  const chainId = chain?.id

  const { config, selectedToken, selectedTokenAmount } = props
  const selectedTokenSymbol = selectedToken.symbol

  const [inputString, setInputString] = useState<string>(
    selectedTokenAmount === '0' ? '' : selectedTokenAmount || ''
  )
  const [tokenBalance, setTokenBalance] = useState<string>(
    BigNumber.from(0).toString()
  )

  useEffect(() => {
    setInputString(selectedTokenAmount === '0' ? '' : selectedTokenAmount || '')
  }, [selectedTokenAmount])

  useEffect(() => {
    onChangeInput('')
  }, [chainId])

  useEffect(() => {
    const tokenBal = getBalance(selectedTokenSymbol)
    setTokenBalance(formattedBalance(selectedToken, tokenBal))
  }, [selectedToken, getBalance, chainId])

  const borderColor = config.isDarkMode ? colors.icWhite : colors.black
  const borderRadius = 16

  const height = '64px'
  const wideWidths = ['250px', '180px']
  const narrowWidths = ['250px']
  const widths = config.isNarrowVersion ? narrowWidths : wideWidths

  const onChangeInput = (amount: string) => {
    if (!amount) {
      setInputString('')
      if (props.onChangeInput) {
        props.onChangeInput(selectedToken, '')
      }
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
    props.onChangeInput(selectedToken, amount)
  }

  return (
    <Flex direction='column'>
      <Text fontSize='20px' fontWeight='700'>
        {props.title}
      </Text>
      <Flex mt='10px' h={height}>
        <Flex
          align='flex-start'
          direction='column'
          justify='center'
          border='1px solid #000'
          borderColor={borderColor}
          borderLeftRadius={borderRadius}
          px={['16px', '30px']}
        >
          <Input
            fontSize='20px'
            placeholder='0.0'
            type='number'
            step='any'
            variant='unstyled'
            disabled={config.isInputDisabled ?? false}
            isReadOnly={config.isReadOnly ?? false}
            value={inputString}
            onChange={(event) => onChangeInput(event.target.value)}
          />
          <Flex>
            <Text
              fontSize='12px'
              textColor={
                isDarkMode ? colors.icGrayDarkMode : colors.icGrayLightMode
              }
            >
              {props.formattedFiat}
            </Text>
            {props.priceImpact && (
              <Text fontSize='12px' textColor={props.priceImpact.colorCoding}>
                &nbsp;{props.priceImpact.priceImpact}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex
          align='center'
          h={height}
          border='1px solid #000'
          borderColor={borderColor}
          borderRightRadius={borderRadius}
          cursor='pointer'
          w={widths}
          onClick={() => props.onSelectedToken(selectedTokenSymbol)}
        >
          {!config.isNarrowVersion && (
            <Box pl='10px' pr='0px'>
              <Image
                src={selectedToken.image}
                alt={`${selectedTokenSymbol} logo`}
                w='24px'
              />
            </Box>
          )}
          <Text ml='8px'>{selectedTokenSymbol}</Text>
        </Flex>
      </Flex>
      <Text
        align='left'
        fontSize='12px'
        fontWeight='400'
        mt='5px'
        onClick={() => {
          if (tokenBalance) {
            const fullTokenBalance = formatUnits(
              getBalance(selectedTokenSymbol) ?? '0',
              selectedToken.decimals
            )
            onChangeInput(fullTokenBalance)
          }
        }}
        cursor='pointer'
      >
        Balance: {tokenBalance}
      </Text>
    </Flex>
  )
}

export default QuickTradeSelector
