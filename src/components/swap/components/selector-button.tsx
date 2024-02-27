import Image from 'next/image'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

type SelectorProps = {
  onClick: () => void
  image: string
  symbol: string
}

export const SelectorButton = ({ image, symbol, onClick }: SelectorProps) => (
  <Flex
    align='center'
    bg={colors.ic.gray[100]}
    borderRadius='32'
    cursor='pointer'
    onClick={onClick}
    p='10px'
    shrink={0}
  >
    <Image alt={`${symbol} logo`} src={image} width={20} height={20} />
    <Text color={colors.ic.black} fontSize={'14px'} fontWeight={500} mx='8px'>
      {symbol}
    </Text>
    <ChevronDownIcon w={6} h={6} color={colors.icGray4} />
  </Flex>
)
