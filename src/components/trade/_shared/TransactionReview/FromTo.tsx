import { useColorStyles } from 'styles/colors'

import { Flex, Image, Spacer, Text } from '@chakra-ui/react'

type FromToProps = {
  inputToken: string
  inputTokenAmount: string
  inputTokenSymbol: string
  outputToken: string
  outputTokenAmount: string
  outputTokenSymbol: string
}

const FromTo = (props: FromToProps) => {
  const { styles } = useColorStyles()
  return (
    <Flex direction='column' w='100%'>
      <FromToItem
        amount={props.inputTokenAmount}
        icon={props.inputToken}
        symbol={props.inputTokenSymbol}
      />
      <FromToItem
        amount={props.outputTokenAmount}
        icon={props.outputToken}
        symbol={props.outputTokenSymbol}
      />
    </Flex>
  )
}

export default FromTo

type FromToItemProps = {
  amount: string
  icon: string
  symbol: string
}

const FromToItem = ({ amount, icon, symbol }: FromToItemProps) => {
  const { styles } = useColorStyles()
  return (
    <Flex align='center' direction='row' justify='space-between' my='8px'>
      <Flex align='center'>
        <Flex bg='blue' mx='8px'>
          <Image
            borderRadius='full'
            boxSize='32px'
            src={icon}
            alt={'token icon'}
          />
        </Flex>
        <Text>{symbol}</Text>
      </Flex>
      <Text>{amount}</Text>
    </Flex>
  )
}
