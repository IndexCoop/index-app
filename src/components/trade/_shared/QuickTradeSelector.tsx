import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { colors, useColorStyles } from 'styles/colors'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Image, Input, Text } from '@chakra-ui/react'
import { formatUnits } from '@ethersproject/units'

import { Token } from 'constants/tokens'
import { useBalances } from 'hooks/useBalance'
import { useNetwork } from 'hooks/useNetwork'
import { isValidTokenInput } from 'utils'

import { formattedBalance } from './QuickTradeFormatter'

interface InputSelectorConfig {
  isDarkMode: boolean
  isNarrowVersion: boolean
  isInputDisabled?: boolean
  isSelectorDisabled?: boolean
  isReadOnly?: boolean
  showMaxLabel: boolean
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
  const { chainId } = useNetwork()
  const { getBalance } = useBalances()
  const { styles } = useColorStyles()

  const { config, selectedToken, selectedTokenAmount } = props
  const selectedTokenSymbol = selectedToken.symbol

  const [inputString, setInputString] = useState<string>(
    selectedTokenAmount === '0' ? '' : selectedTokenAmount || ''
  )
  const [tokenBalance, setTokenBalance] = useState<string>(
    BigNumber.from(0).toString()
  )

  useEffect(() => {
    setInputString(selectedTokenAmount === '0' ? '' : selectedTokenAmount || '') // TODO: Need comma separated number here
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

    setInputString(amount) // TODO: Need comma separated number here
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
        bg={styles.background}
        border='1px solid'
        borderColor={borderColor}
        borderRadius={borderRadius}
        direction='column'
        mt='10px'
        p='16px'
      >
        <Flex align='flex-start' direction='row' justify='space-between'>
          <Input
            color={styles.text2}
            fontSize='28px'
            overflow='hidden'
            placeholder='0.0'
            pr='4px'
            type='number'
            step='any'
            textOverflow='ellipsis'
            variant='unstyled'
            whiteSpace='nowrap'
            disabled={config.isInputDisabled ?? false}
            isReadOnly={config.isReadOnly ?? false}
            value={inputString}
            onChange={(event) => onChangeInput(event.target.value)}
          />
          <Selector
            onClick={() => props.onSelectedToken(selectedTokenSymbol)}
            isNarrowVersion={config.isNarrowVersion}
            selectedTokenImage={selectedToken.image}
            selectedTokenSymbol={selectedTokenSymbol}
          />
        </Flex>
        <Flex
          align='flex-start'
          direction='row'
          justify='space-between'
          mt='8px'
        >
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
          <Balance
            balance={tokenBalance}
            onClick={onClickBalance}
            showMaxLabel={config.showMaxLabel}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

type BalanceProps = {
  balance: string
  onClick: () => void
  showMaxLabel: boolean
}

const Balance = ({ balance, onClick, showMaxLabel }: BalanceProps) => (
  <Flex cursor='pointer' onClick={onClick} mr='4px'>
    <Text color={colors.icGray2} fontSize='14px' fontWeight='400'>
      Balance: {balance}
    </Text>
    {showMaxLabel === true && (
      <Flex
        align='center'
        bg={colors.icBlue10}
        borderRadius='12px'
        justify='center'
        py='2px'
        px='6px'
        ml='4px'
      >
        <Text color={colors.icBlue2} fontSize='10px'>
          MAX
        </Text>
      </Flex>
    )}
  </Flex>
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
    px='2'
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
    <ChevronDownIcon ml={1} w={6} h={6} color={colors.icGray4} />
  </Flex>
)

export default QuickTradeSelector
