import Image from 'next/image'

import { Token } from '@/constants/tokens'
import { cn } from '@/lib/utils/tailwind'

type TokenDisplayProps = {
  className?: string
  mini?: boolean
  smHideLabel?: boolean
  token: Token
}

export function TokenDisplay({
  className,
  mini = false,
  smHideLabel = false,
  token,
}: TokenDisplayProps) {
  const { image, symbol } = token
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-1 py-2',
        mini && 'py-0',
        className,
      )}
    >
      <Image
        alt={`${symbol} logo`}
        src={image}
        width={mini ? 20 : 24}
        height={mini ? 20 : 24}
        priority
      />
      <span
        className={cn(
          'text-ic-gray-900 dark:text-ic-white ml-[2px] text-sm font-medium sm:mx-1 sm:text-xl',
          mini && 'sm:text-base',
          smHideLabel && 'hidden sm:block',
        )}
      >
        {symbol}
      </span>
    </div>
  )
}
