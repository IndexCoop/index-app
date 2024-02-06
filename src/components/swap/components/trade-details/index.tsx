import { useState } from 'react'
import { WarningTwoIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from '@chakra-ui/react'

import { StyledSkeleton } from '@/components/skeleton'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { colors, useColorStyles } from '@/lib/styles/colors'

import { TradeInfoItem } from '../../types'
import { Tag } from './tag'
import { FlashMintTag } from './tag-flashmint'
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
  isLoading: boolean
  prices: TradeDetailTokenPrices
  showWarning?: boolean
  selectedQuoteType: QuoteType
}

export const TradeDetails = (props: TradeDetailsProps) => {
  const { data, isLoading, prices, showWarning } = props
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
    <Flex mb={'6px'}>
      <Accordion allowToggle border={0} borderColor='transparent' w='100%'>
        <AccordionItem isDisabled={isLoading}>
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
                    <>
                      <Flex>
                        {showWarning && (
                          <WarningTwoIcon color={styles.text} mr='8px' />
                        )}
                        <Box onClick={onToggleTokenPrice}>
                          {isLoading ? (
                            <StyledSkeleton width={200} />
                          ) : (
                            <TradePrice
                              comparisonLabel={comparisonLabel}
                              usdLabel={usdLabel}
                            />
                          )}
                        </Box>
                      </Flex>
                      <Flex opacity={isExpanded ? 0 : 1} gap={4}>
                        {!isLoading &&
                          props.selectedQuoteType === QuoteType.zeroex && (
                            <Tag label={'0x'} />
                          )}
                        {!isLoading &&
                          props.selectedQuoteType === QuoteType.flashmint && (
                            <FlashMintTag />
                          )}
                        {isLoading && <StyledSkeleton width={70} />}
                      </Flex>
                    </>
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
                <TradeInfoItemsContainer items={data} isLoading={isLoading} />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}
