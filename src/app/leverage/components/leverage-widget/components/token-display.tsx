import Image from 'next/image'

import { Token } from '@/constants/tokens'

type TokenDisplayProps = {
  token: Token
}

export function TokenDisplay(props: TokenDisplayProps) {
  const { image, symbol } = props.token
  return (
    <div className='flex flex-row items-center gap-1 py-2'>
      <Image alt={`${symbol} logo`} src={image} width={24} height={24} />
      <span className='text-ic-white ml-[2px] text-sm font-medium sm:mx-1 sm:text-xl'>
        {symbol}
      </span>
    </div>
  )
}
