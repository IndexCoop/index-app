import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from '@chakra-ui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'

import { StyledSkeleton } from '@/components/skeleton'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { colors, useColorStyles } from '@/lib/styles/colors'
import { cn } from '@/lib/utils/tailwind'

import { TradeInfoItem } from '../../types'

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
                  color={colors.ic.gray[400]}
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
                          <ExclamationTriangleIcon className='text-ic-gray-600 dark:text-ic-gray-400 mr-2 size-5' />
                        )}
                        {!showWarning && (
                          <Image
                            className='text-ic-gray-600 mr-1'
                            alt='Swap icon'
                            src='/assets/swap-icon.svg'
                            width={16}
                            height={16}
                          />
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
                      <div className={cn('flex gap-4', isExpanded && 'hidden')}>
                        {!isLoading &&
                          props.selectedQuoteType === QuoteType.index && (
                            <FlashMintTag />
                          )}
                        {!isLoading &&
                          props.selectedQuoteType === QuoteType.flashmint && (
                            <FlashMintTag />
                          )}
                        {isLoading && <StyledSkeleton width={70} />}
                      </div>
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
