import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from '@chakra-ui/react'

export const TradeDetail = () => {
  return (
    <Flex>
      <Accordion allowToggle w='100%'>
        <AccordionItem>
          <h4>
            <AccordionButton>
              <Box flex='1'>Section 1 title</Box>
              <AccordionIcon />
            </AccordionButton>
          </h4>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}
