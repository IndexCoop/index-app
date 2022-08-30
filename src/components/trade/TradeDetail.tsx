import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from '@chakra-ui/react'

import { colors, useColorStyles } from 'styles/colors'

export const TradeDetail = () => {
  const { styles } = useColorStyles()

  return (
    <Flex>
      <Accordion allowToggle border={0} borderColor='transparent' w='100%'>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h4>
                <AccordionButton
                  borderRadius={16}
                  _expanded={{
                    bg: styles.background,
                    border: '1px solid',
                    borderColor: styles.border,
                    color: styles.text,
                  }}
                >
                  <Flex
                    align='center'
                    flex='1'
                    justify='space-between'
                    pr='8px'
                  >
                    <InfoOutlineIcon color={styles.text} />
                    {!isExpanded && <GasFees label='0.0035 ETH' />}
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h4>
              <AccordionPanel pb={4}></AccordionPanel>
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
