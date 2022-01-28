import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react'

import arrowIcon from 'assets/selector-down-arrow.svg'

const white = '#F6F1E4'
const selectedTabStyle = {
  bg: white,
  borderRadius: '4px',
  color: 'black',
  outline: 0,
}

interface InputSelectorProps {
  title: string
  // onChangeInput: (input: number) => void
  balance: string
  // token: string
}

const InputSelector = ({ balance, title }: InputSelectorProps) => {
  return (
    <Flex direction='column'>
      <Text fontSize='20px' fontWeight='700'>
        {title}
      </Text>
      <Flex mt='10px' h='54px'>
        <Flex
          align='center'
          justify='center'
          grow='1'
          border='1px solid #F6F1E4'
          px='40px'
        >
          <Input placeholder='0' variant='unstyled' />
          <Spacer />
          <Text align='right' fontSize='12px' fontWeight='400' w='100%'>
            Balance: {balance}
          </Text>
        </Flex>
        <Flex
          align='center'
          justify='center'
          h='100%'
          border='1px solid #F6F1E4'
          cursor='pointer'
          px='24px'
          onClick={() => console.log('select')}
        >
          <Image src={''} width={'10%'} />
          <Text fontSize='24px' fontWeight='600' mx='16px'>
            ETH
          </Text>
          <Image src={arrowIcon} w='20px' h='20px' />
        </Flex>
      </Flex>
    </Flex>
  )
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
    <Flex direction='column' my='20px'>
      <InputSelector title='From' balance='1.263 ETH' />
      <Box h='12px' />
      <InputSelector title='To' balance='0.000 DPI' />
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
