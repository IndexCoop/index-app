import Image from 'next/image'

import { StyledSkeleton } from '@/components/skeleton'
import { Caption } from '@/components/swap/components/caption'
import { Token } from '@/constants/tokens'

type ReceiveProps = {
  isLoading: boolean
  outputAmount: string
  outputAmountUsd?: string
  ouputTokens: Token[]
  showSelectorButtonChevron?: boolean
  onSelectToken: () => void
}

export function Receive(props: ReceiveProps) {
  const { isLoading, outputAmount, outputAmountUsd, ouputTokens } = props
  return (
    <div className='border-ic-gray-100 flex flex-row justify-between rounded-xl border p-4 dark:border-[#3A6060]'>
      <div className='flex flex-col'>
        <Caption caption='Receive' />
        {isLoading && <StyledSkeleton width={120} />}
        {!isLoading && (
          <span className='dark:text-ic-white text-ic-gray-600'>
            {outputAmount}
          </span>
        )}
        {!isLoading && outputAmountUsd && (
          <span className='dark:text-ic-white text-ic-gray-400 text-xs'>
            {outputAmountUsd}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        {ouputTokens.length > 0 &&
          ouputTokens.map((outputToken) => (
            <OutputTokenView
              image={outputToken.image}
              symbol={outputToken.symbol}
            />
          ))}
      </div>
    </div>
  )
}

type OutputTokenViewProps = {
  image: string
  symbol: string
}

export const OutputTokenView = ({ image, symbol }: OutputTokenViewProps) => (
  <div className='flex flex-row items-center'>
    <Image alt={`${symbol} logo`} src={image} width={20} height={20} />
    <span className='text-ic-black mx-2 text-sm font-medium'> {symbol}</span>
  </div>
)
