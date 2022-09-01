import { useState } from 'react'

import { colors, useColorStyles } from 'styles/colors'

import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'

import TradeInfo, { TradeInfoItem } from './TradeInfo'
import { TradePrice } from './TradePrice'

export type TradeDetailTokenPrices = {
  inputTokenPrice: string
  inputTokenPriceUsd: string
  outputTokenPrice: string
  outputTokenPriceUsd: string
}

type TradeDetailProps = {
  data: TradeInfoItem[]
  prices: TradeDetailTokenPrices
}

export const TradeDetail = ({ data, prices }: TradeDetailProps) => {
  const isWeb = useBreakpointValue({ base: false, md: true, lg: true })
  const [showInputTokenPrice, setShowInputTokenPrice] = useState(true)
  const { styles } = useColorStyles()

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
    <Flex>
      <Accordion allowToggle border={0} borderColor='transparent' w='100%'>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h4>
                <AccordionButton
                  border='1px solid'
                  borderColor={styles.border}
                  borderRadius={16}
                  _expanded={{
                    bg: styles.background,
                    borderBottomColor: styles.background,
                    borderBottomRadius: 0,
                    color: styles.text,
                  }}
                >
                  <Flex
                    align='center'
                    flex='1'
                    justify='space-between'
                    pr='8px'
                  >
                    <Flex>
                      {isWeb && (
                        <InfoOutlineIcon color={styles.text} mr='8px' />
                      )}
                      <Box onClick={onToggleTokenPrice}>
                        <TradePrice
                          comparisonLabel={comparisonLabel}
                          usdLabel={usdLabel}
                        />
                      </Box>
                    </Flex>
                    <Box opacity={isExpanded ? 0 : 1}>
                      <GasFees label={data[1].values[0]} />
                    </Box>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h4>
              <AccordionPanel
                bg={styles.background}
                border='1px solid'
                borderColor={styles.border}
                borderRadius='0 0 16px 16px'
                borderTopColor={styles.background}
              >
                <TradeInfo data={data} />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}

const GasFees = ({ label }: { label: string }) => (
  <Flex bg={colors.icGray1} borderRadius={16} fontSize='12px' px='2' py='0'>
    <Text color={colors.icGray4}>Gas {label}</Text>
  </Flex>
)
