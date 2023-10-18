import Image from 'next/image'
import { colors, useColorStyles } from '@/lib/styles/colors'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Input, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'

interface InputSelectorConfig {
  isDarkMode: boolean
  isNarrowVersion: boolean
  isInputDisabled?: boolean
  isSelectorDisabled?: boolean
  isReadOnly?: boolean
  showMaxLabel: boolean
}

const TradeInputSelector = (props: {
  config: InputSelectorConfig
  formattedFiat: string
  // Used from swap to show price impact behind fiat value
  priceImpact?: { priceImpact: string; colorCoding: string }
  selectedToken: Token
  selectedTokenAmount: string
  selectedTokenBalance: string
  onClickBalance: () => void
  onSelectedToken: (symbol: string) => void
  onChangeInput?: (token: Token, input: string) => void
}) => {
  const { styles } = useColorStyles()
  const { config, selectedToken, selectedTokenAmount, selectedTokenBalance } =
    props
  const borderColor = styles.border
  const borderRadius = 16
  const selectedTokenSymbol = selectedToken.symbol

  const onChangeInput = (amount: string) => {
    if (
      props.onChangeInput === undefined ||
      config.isInputDisabled ||
      config.isSelectorDisabled ||
      config.isReadOnly
    )
      return
    props.onChangeInput(selectedToken, amount)
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
            value={selectedTokenAmount}
            onChange={(event) => {
              onChangeInput(event.target.value)
            }}
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
            balance={selectedTokenBalance}
            onClick={props.onClickBalance}
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
    {showMaxLabel && (
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
      <Image
        alt={`${selectedTokenSymbol} logo`}
        src={selectedTokenImage}
        width={24}
        height={24}
      />
    </Box>
    <Text color={colors.icGray4} ml='10px' mr='8px'>
      {selectedTokenSymbol}
    </Text>
    <ChevronDownIcon w={6} h={6} color={colors.icGray4} />
  </Flex>
)

export default TradeInputSelector
