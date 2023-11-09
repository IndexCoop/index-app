import { useColorStyles } from '@/lib/styles/colors'

import { ArrowDownIcon } from '@chakra-ui/icons'
import { Flex, Image, Spacer, Text } from '@chakra-ui/react'

type FromToProps = {
  inputToken: string
  inputTokenAmount: string
  inputTokenSymbol: string
  outputToken: string
  outputTokenAmount: string
  outputTokenSymbol: string
}

export const FromTo = (props: FromToProps) => {
  const { styles } = useColorStyles()
  return (
    <Flex align='center' direction='column' w='100%'>
      <FromToItem
        amount={props.inputTokenAmount}
        icon={props.inputToken}
        symbol={props.inputTokenSymbol}
      />
      <Flex
        bg={styles.backgroundInverted}
        borderRadius={'16px'}
        p='8px'
        my='-20px'
        zIndex={1}
      >
        <ArrowDownIcon color={styles.background} />
      </Flex>
      <FromToItem
        amount={props.outputTokenAmount}
        icon={props.outputToken}
        symbol={props.outputTokenSymbol}
      />
    </Flex>
  )
}

type FromToItemProps = {
  amount: string
  icon: string
  symbol: string
}

const FromToItem = ({ amount, icon, symbol }: FromToItemProps) => {
  const { styles } = useColorStyles()
  return (
    <Flex
      align='center'
      direction='row'
      justify='space-between'
      my='8px'
      border='1px solid'
      borderColor={styles.border}
      borderRadius='16px'
      p='12px 16px'
      w='100%'
    >
      <Flex align='center'>
        <Flex mx='8px'>
          <Image
            borderRadius='full'
            boxSize='32px'
            src={icon}
            alt={'token icon'}
          />
        </Flex>
        <Text fontWeight='500'>{symbol}</Text>
      </Flex>
      <Text fontSize='18px' fontWeight='500'>
        {amount}
      </Text>
    </Flex>
  )
}
