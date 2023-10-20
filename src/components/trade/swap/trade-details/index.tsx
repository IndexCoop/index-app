import { useState } from 'react'

import { colors, useColorStyles } from '@/lib/styles/colors'

import { InfoOutlineIcon, WarningTwoIcon } from '@chakra-ui/icons'
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

import TradeInfo, { TradeInfoItem } from './trade-info'
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
  const isWeb = useBreakpointValue({ base: false, md: true, lg: true })
  const { styles } = useColorStyles()

  const [showInputTokenPrice, setShowInputTokenPrice] = useState(true)

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
                  borderRadius={12}
                  color={colors.icGray2}
                  _expanded={{
                    bg: styles.background,
                    borderBottomColor: styles.background,
                    borderBottomRadius: 0,
                  }}
                  p={'12px'}
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
                      {/* {isWeb && !showWarning && (
                        <InfoOutlineIcon color={styles.text} mr='8px' />
                      )} */}
                      <Box onClick={onToggleTokenPrice}>
                        <TradePrice
                          comparisonLabel={comparisonLabel}
                          usdLabel={usdLabel}
                        />
                      </Box>
                    </Flex>
                    <Box opacity={isExpanded ? 0 : 1}>
                      <GasFees label={gasPriceInUsd.toFixed(2)} />
                    </Box>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h4>
              <AccordionPanel
                bg={styles.background}
                border='1px solid'
                borderColor={styles.border}
                borderRadius='0 0 12px 12px'
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
  <Flex>
    <Text color={colors.icGray2} fontSize='12px' fontWeight={500}>
      Gas ${label}
    </Text>
  </Flex>
)
