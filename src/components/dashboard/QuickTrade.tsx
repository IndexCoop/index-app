import {
  Box,
  Button,
  Flex,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react'

const white = '#F6F1E4'
const selectedTabStyle = {
  bg: white,
  borderRadius: '4px',
  color: 'black',
  outline: 0,
}

const QuickTrade = (props: {}) => (
  <Flex
    backgroundColor='#292929'
    border='2px solid #F7F1E4'
    borderRadius='16px'
    direction='column'
    py='20px'
    px='40px'
  >
    <Flex>
      <Text fontSize='24px' fontWeight='700'>
        Quick Trade
      </Text>
      <Spacer />
      <Tabs
        background='#1D1B16'
        borderRadius='8px'
        fontSize='16px'
        fontWeight='500'
        height='45px'
        color={white}
        outline='0'
        variant='unstyle'
      >
        <TabList>
          <Tab _selected={selectedTabStyle}>DEX Swap</Tab>
          <Tab _selected={selectedTabStyle}>Index Issuance</Tab>
        </TabList>
      </Tabs>
    </Flex>
    <Flex>
      <Button
        background='#F7F1E4'
        border='0'
        borderRadius='12px'
        color='#000'
        fontSize='24px'
        fontWeight='600'
        height='54px'
        w='100%'
      >
        Buy
      </Button>
    </Flex>
  </Flex>
)

export default QuickTrade
