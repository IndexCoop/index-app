import { Flex } from '@chakra-ui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

import { colors } from '@/lib/styles/colors'

type SelectorProps = {
  onClick: () => void
  image: string
  symbol: string
  showChevron?: boolean
  visible?: boolean
}

export const SelectorButton = ({
  image,
  symbol,
  onClick,
  showChevron,
  visible = true,
}: SelectorProps) => (
  <Flex
    align='center'
    bg={colors.ic.gray[100]}
    borderRadius='32'
    cursor='pointer'
    onClick={onClick}
    p='10px'
    h='44px'
    shrink={0}
    visibility={visible ? 'visible' : 'hidden'}
  >
    <Image alt={`${symbol} logo`} src={image} width={20} height={20} />
    <p className='text-ic-black mx-2 text-sm font-medium'>{symbol}</p>
    {showChevron !== false && (
      <ChevronDownIcon className='text-ic-gray-900 size-6' />
    )}
  </Flex>
)
