import { useState } from 'react'

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Select,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react'

interface QuickTradeToken {
  symbol: string
  icon: string
  balance?: string
}

interface InputSelectorProps {
  title: string
  selectedToken: QuickTradeToken
  tokenList: QuickTradeToken[]
  onChange: (symbol: string) => void
}

interface QuickTradeProps {
  tokenList1: QuickTradeToken[]
  tokenList2: QuickTradeToken[]
}

const InputSelector = ({
  selectedToken,
  tokenList,
  title,
  onChange,
}: InputSelectorProps) => {
  const { balance, symbol, icon } = selectedToken
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
          <Input placeholder='0' type='number' variant='unstyled' />
          <Spacer />
          <Text align='right' fontSize='12px' fontWeight='400' w='100%'>
            Balance: {balance} {symbol}
          </Text>
        </Flex>
        <Flex
          align='center'
          h='54px'
          border='1px solid #F6F1E4'
          minWidth='125px'
          px='24px'
        >
          <Image src={icon} width='24px' height='24px' />
          <Select
            border='0'
            w='100%'
            minWidth='100px'
            h='54px'
            onChange={(event) => {
              console.log(event.target.value)
              onChange(event.target.value)
            }}
          >
            {tokenList.map((token) => {
              const { symbol } = token
              return (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              )
            })}
          </Select>
        </Flex>
      </Flex>
    </Flex>
  )
}

const QuickTrade = ({ tokenList1, tokenList2 }: QuickTradeProps) => {
  const [selectedToken1, setSelectedToken1] = useState<{
    symbol: string
    icon: string
    balance: string
  }>({
    symbol: tokenList1[0].symbol,
    icon: tokenList1[0].icon,
    balance: '1.263',
  })
  const [selectedToken2, setSelectedToken2] = useState<{
    symbol: string
    icon: string
    balance: string
  }>({
    symbol: tokenList2[0].symbol,
    icon: tokenList2[0].icon,
    balance: '0.000',
  })

  const onChangeSelect1 = (symbol: string) => {
    const filteredList = tokenList1.filter((token) => token.symbol === symbol)
    if (filteredList.length < 0) {
      return
    }
    const selectedToken = filteredList[0]
    setSelectedToken1({
      ...selectedToken1,
      symbol: selectedToken.symbol,
      icon: selectedToken.icon,
    })
  }

  const onChangeSelect2 = (symbol: string) => {
    const filteredList = tokenList2.filter((token) => token.symbol === symbol)
    if (filteredList.length < 0) {
      return
    }
    const selectedToken = filteredList[0]
    setSelectedToken2({
      ...selectedToken2,
      symbol: selectedToken.symbol,
      icon: selectedToken.icon,
    })
  }

  return (
    <Flex
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
        <InputSelector
          title='From'
          selectedToken={selectedToken1}
          tokenList={tokenList1}
          onChange={onChangeSelect1}
        />
        <Box h='12px' />
        <InputSelector
          title='To'
          selectedToken={selectedToken2}
          tokenList={tokenList2}
          onChange={onChangeSelect2}
        />
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
}

const white = '#F6F1E4'
const selectedTabStyle = {
  bg: white,
  borderRadius: '4px',
  color: 'black',
  outline: 0,
}

export default QuickTrade
