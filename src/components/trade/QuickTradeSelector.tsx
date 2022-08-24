import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { colors, useColorStyles } from 'styles/colors'
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
  const { styles } = useColorStyles()
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
    setInputString(selectedTokenAmount === '0' ? '' : selectedTokenAmount || '') // TODO: Can make impact here
  }, [selectedTokenAmount])

  useEffect(() => {
    onChangeInput('')
  }, [chainId])

  useEffect(() => {
    const tokenBal = getBalance(selectedTokenSymbol)
    setTokenBalance(formattedBalance(selectedToken, tokenBal))
  }, [selectedToken, getBalance, chainId])

  const borderColor = styles.border
  const borderRadius = 16

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

    setInputString(amount) // TODO: Can make impact here
    props.onChangeInput(selectedToken, amount)
  }

  const onClickBalance = () => {
    if (!tokenBalance) return
    const fullTokenBalance = formatUnits(
      getBalance(selectedTokenSymbol) ?? '0',
      selectedToken.decimals
    )
    onChangeInput(fullTokenBalance)
  }

  return (
    <Flex direction='column'>
      <Text fontSize='20px' fontWeight='700'>
        {props.title}
      </Text>
      <Flex
        align='center'
        justify='space-between'
        bg={styles.background}
        border='1px solid'
        borderColor={borderColor}
        borderRadius={borderRadius}
        mt='10px'
        px={['16px', '20px']}
        py='12px'
      >
        <Flex direction='column'>
          <Input
            color={styles.text2}
            fontSize='24px'
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
            <Text fontSize='14px' textColor={styles.text3}>
              {props.formattedFiat}
            </Text>
            {props.priceImpact && (
              <Text fontSize='14px' textColor={props.priceImpact.colorCoding}>
                &nbsp;{props.priceImpact.priceImpact}
              </Text>
            )}
          </Flex>
        </Flex>
        <Selector
          onClick={() => props.onSelectedToken(selectedTokenSymbol)}
          isNarrowVersion={config.isNarrowVersion}
          selectedTokenImage={selectedToken.image}
          selectedTokenSymbol={selectedTokenSymbol}
        />
      </Flex>
      <Balance balance={tokenBalance} onClick={onClickBalance} />
    </Flex>
  )
}

type BalanceProps = {
  balance: string
  onClick: () => void
}

const Balance = ({ balance, onClick }: BalanceProps) => (
  <Text
    align='left'
    fontSize='12px'
    fontWeight='400'
    mt='5px'
    onClick={onClick}
    cursor='pointer'
  >
    Balance: {balance}
  </Text>
)

type SelectorProps = {
  isNarrowVersion: boolean
  onClick: () => void
  selectedTokenImage: string
  selectedTokenSymbol: string
}

const Selector = ({
  isNarrowVersion,
  onClick,
  selectedTokenImage,
  selectedTokenSymbol,
}: SelectorProps) => (
  <Flex
    bg={colors.icGray1}
    borderRadius='32'
    boxShadow='sm'
    cursor='pointer'
    onClick={onClick}
    py='2'
    pl='3'
    pr='4'
    shrink={0}
  >
    {!isNarrowVersion && (
      <Box mr='8px' w='24px'>
        <Image
          src={selectedTokenImage}
          alt={`${selectedTokenSymbol} logo`}
          w='24px'
        />
      </Box>
    )}
    <Text color={colors.icGray4}>{selectedTokenSymbol}</Text>
  </Flex>
)

export default QuickTradeSelector
