import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
} from '@chakra-ui/react'

import { useColorStyles } from 'styles/colors'

export const TradeDetail = () => {
  const { styles } = useColorStyles()

  return (
    <Flex>
      <Accordion allowToggle border={0} borderColor='transparent' w='100%'>
        <AccordionItem>
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
              <Flex align='center' flex='1' justify='flex-start'>
                <InfoOutlineIcon color={styles.text} />
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h4>
          <AccordionPanel pb={4}></AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}
