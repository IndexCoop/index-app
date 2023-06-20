import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { colors, useColorStyles } from '@/lib/styles/colors'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { formatUnits } from '@ethersproject/units'

import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useBalanceData } from '@/lib/providers/Balances'
import { isValidTokenInput } from '@/lib/utils'

import { formattedBalance } from './QuickTradeFormatter'

interface InputSelectorConfig {
  isDarkMode: boolean
  isNarrowVersion: boolean
  isInputDisabled?: boolean
  isSelectorDisabled?: boolean
  isReadOnly?: boolean
  showMaxLabel: boolean
}

const TradeInputSelector = (props: {
  // rename
  config: InputSelectorConfig
  // TODO: change this on url load
  selectedToken: Token
  selectedTokenAmount?: string // remove
  // Used from swap to show price impact behind fiat value
  priceImpact?: { priceImpact: string; colorCoding: string }
  formattedFiat: string
  onChangeInput?: (token: Token, input: string) => void
  // onClick
  onSelectedToken: (symbol: string) => void
}) => {
  // remove if not needed
  const { chainId } = useNetwork()
  // shouldn't be in here
  const { isLoading, getTokenBalance } = useBalanceData()
  const { styles } = useColorStyles()

  const { config, selectedToken, selectedTokenAmount } = props
  const selectedTokenSymbol = selectedToken.symbol

  // remove?
  const [inputString, setInputString] = useState<string>(
    selectedTokenAmount === '0' ? '' : selectedTokenAmount || ''
  )
  // remove
  const [tokenBalance, setTokenBalance] = useState<string>(
    BigNumber.from(0).toString()
  )

  // TODO: format from outside
  useEffect(() => {
    setInputString(selectedTokenAmount === '0' ? '' : selectedTokenAmount || '') // TODO: Need comma separated number here
  }, [selectedTokenAmount])

  useEffect(() => {
    onChangeInput('')
  }, [chainId])

  useEffect(() => {
    if (isLoading) return
    const tokenBal = getTokenBalance(selectedTokenSymbol, chainId)
    setTokenBalance(formattedBalance(selectedToken, tokenBal))
  }, [isLoading, getTokenBalance, selectedToken])

  const borderColor = styles.border
  const borderRadius = 16

  // move
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

  // move
  const onClickBalance = () => {
    if (!tokenBalance) return
    const fullTokenBalance = formatUnits(
      getTokenBalance(selectedTokenSymbol, chainId) ?? '0',
      selectedToken.decimals
    )
    onChangeInput(fullTokenBalance)
  }

  return (
    <Flex direction='column'>
      <Flex
        bg={styles.background}
        border='1px solid'
        borderColor={borderColor}
        borderRadius={borderRadius}
        direction='column'
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
          <SelectorButton
            onClick={() => props.onSelectedToken(selectedTokenSymbol)}
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
  onClick: () => void
  selectedTokenImage: string
  selectedTokenSymbol: string
}

const SelectorButton = ({
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
    py='10px'
    px='10px'
    shrink={0}
  >
    <Box w='24px'>
      <img
        alt={`${selectedTokenSymbol} logo`}
        src={selectedTokenImage}
        width='24px'
        height='24px'
      />
    </Box>
    <Text color={colors.icGray4} ml='10px' mr='8px'>
      {selectedTokenSymbol}
    </Text>
    <ChevronDownIcon w={6} h={6} color={colors.icGray4} />
  </Flex>
)

export default TradeInputSelector
