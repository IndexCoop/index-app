import { useState } from 'react'
import Image from 'next/image'
import { WarningTwoIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react'

import { Toggle, ToggleState } from '@/components/toggle'
import { colors, useColorStyles } from '@/lib/styles/colors'

import { TradeInfoItem } from '../../types'
import { Tag } from './tag'
import { TradeInfoItemsContainer } from './trade-info'
import { TradePrice } from './trade-price'

export interface TradeDetailTokenPrices {
  inputTokenPrice: string
  inputTokenPriceUsd: string
  outputTokenPrice: string
  outputTokenPriceUsd: string
}

interface TradeDetailsProps {
  data: TradeInfoItem[]
  gasPriceInUsd: number
  prices: TradeDetailTokenPrices
  showWarning?: boolean
}

export const TradeDetails = (props: TradeDetailsProps) => {
  const { data, gasPriceInUsd, prices, showWarning } = props
  const { styles } = useColorStyles()

  const [showInputTokenPrice, setShowInputTokenPrice] = useState(true)

  const onClickToggle = (toggleState: ToggleState) => {
    console.log(toggleState)
  }

  const onToggleTokenPrice = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setShowInputTokenPrice(!showInputTokenPrice)
  }

  const comparisonLabel = showInputTokenPrice
    ? prices.inputTokenPrice
    : prices.outputTokenPrice
  const usdLabel = showInputTokenPrice
    ? prices.inputTokenPriceUsd
    : prices.outputTokenPriceUsd

  return (
    <Flex mb={'6px'}>
      <Accordion allowToggle border={0} borderColor='transparent' w='100%'>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h4>
                <AccordionButton
                  border='1px solid'
                  borderColor={styles.border}
                  borderRadius={12}
                  color={colors.icGray2}
                  _expanded={{
                    borderBottomColor: 'transparent',
                    borderBottomRadius: 0,
                  }}
                  p={'16px 20px'}
                >
                  <Flex
                    align='center'
                    flex='1'
                    justify='space-between'
                    pr='4px'
                  >
                    <Flex>
                      {showWarning && (
                        <WarningTwoIcon color={styles.text} mr='8px' />
                      )}
                      <Box onClick={onToggleTokenPrice}>
                        <TradePrice
                          comparisonLabel={comparisonLabel}
                          usdLabel={usdLabel}
                        />
                      </Box>
                    </Flex>
                    <Flex opacity={isExpanded ? 0 : 1} gap={4}>
                      <Tag label={'FlashMint'} />
                      <GasFees label={gasPriceInUsd.toFixed(2)} />
                    </Flex>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h4>
              <AccordionPanel
                border='1px solid'
                borderColor={styles.border}
                borderRadius='0 0 12px 12px'
                borderTopColor={'transparent'}
                p={'4px 20px 16px'}
              >
                <Toggle
                  toggleState={ToggleState.auto}
                  labelLeft='Swap'
                  labelRight='Flash Mint'
                  onClick={onClickToggle}
                />
                <TradeInfoItemsContainer items={data} />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}

const GasFees = ({ label }: { label: string }) => (
  <Flex direction={'row'} gap={2}>
    <Image
      alt='Gas fees icon'
      src={'/assets/gas-icon.svg'}
      height={10}
      width={10}
    />
    <Text color={colors.icGray2} fontSize='12px' fontWeight={500}>
      ${label}
    </Text>
  </Flex>
)
