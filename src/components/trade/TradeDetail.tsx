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
} from '@chakra-ui/react'

import TradeInfo, { TradeInfoItem } from './TradeInfo'
import { TradePrice } from './TradePrice'

export const TradeDetail = ({ data }: { data: TradeInfoItem[] }) => {
  const { styles } = useColorStyles()
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
                      <InfoOutlineIcon color={styles.text} mr='8px' />
                      <TradePrice
                        comparisonLabel={'1 ETH = 1561 USDC'}
                        usdLabel={'($1,500.00)'}
                      />
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
  <Flex bg={colors.icGray1} borderRadius={16} fontSize='12px' px='2' py='1'>
    <Text color={colors.icGray4}>Gas {label}</Text>
  </Flex>
)
