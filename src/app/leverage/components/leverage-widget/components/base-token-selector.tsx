import { ChevronDownIcon } from '@chakra-ui/icons'
import Image from 'next/image'

import { Token } from '@/constants/tokens'

type BaseTokenSelectorProps = {
  baseToken: Token
  onClick: () => void
}

export function BaseTokenSelector(props: BaseTokenSelectorProps) {
  const { image, symbol } = props.baseToken
  return (
    <div
      className='flex cursor-pointer flex-row items-center py-2'
      onClick={props.onClick}
    >
      <Image alt={`${symbol} logo`} src={image} width={24} height={24} />
      <span className='text-ic-black dark:text-ic-white mx-1 text-xl font-medium'>
        {symbol}
      </span>
      <ChevronDownIcon
        className='dark:fill-ic-white fill-ic-black'
        w={6}
        h={6}
      />
    </div>
  )
}
