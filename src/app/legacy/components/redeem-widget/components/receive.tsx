import Image from 'next/image'

import { StyledSkeleton } from '@/components/skeleton'
import { Caption } from '@/components/swap/components/caption'
import { Token } from '@/constants/tokens'

type ReceiveProps = {
  isLoading: boolean
  outputAmounts: string[]
  outputAmountsUsd: string[]
  ouputTokens: Token[]
  totalOutputAmountUsd: string
  onSelectToken: () => void
}

export function Receive(props: ReceiveProps) {
  const {
    isLoading,
    outputAmounts,
    outputAmountsUsd,
    ouputTokens,
    totalOutputAmountUsd,
  } = props
  return (
    <div className='border-ic-gray-100 flex flex-col justify-between gap-4 rounded-xl border p-4 dark:border-[#3A6060]'>
      <div className='flex flex-col'>
        <Caption caption='Receive' />
        {isLoading && <StyledSkeleton width={120} />}
        {!isLoading && ouputTokens.length === 1 && (
          <span className='dark:text-ic-white text-ic-gray-600'>
            {outputAmounts[0]}
          </span>
        )}
        {!isLoading && (
          <span className='dark:text-ic-white text-ic-gray-400 text-xs'>
            {totalOutputAmountUsd}
          </span>
        )}
      </div>
      <div className='flex w-full flex-col gap-1'>
        {ouputTokens.length > 0 &&
          ouputTokens.map((outputToken, index) => (
            <OutputTokenView
              image={outputToken.image}
              outputAmount={outputAmounts[index]}
              outputAmountUsd={outputAmountsUsd[index]}
              symbol={outputToken.symbol}
              key={outputToken.address}
            />
          ))}
      </div>
    </div>
  )
}

type OutputTokenViewProps = {
  image: string
  outputAmount: string
  outputAmountUsd: string
  symbol: string
}

export const OutputTokenView = ({
  image,
  outputAmount,
  outputAmountUsd,
  symbol,
}: OutputTokenViewProps) => (
  <div className='flex w-full flex-row items-center gap-4 text-sm'>
    <div className='flex flex-row items-center gap-2'>
      <span>{outputAmount}</span>
      <span className='text-ic-gray-400 text-xs'>{`(${outputAmountUsd})`}</span>
    </div>
    <div className='flex flex-row'>
      <Image alt={`${symbol} logo`} src={image} width={20} height={20} />
      <span className='text-ic-black mx-2 font-medium'> {symbol}</span>
    </div>
  </div>
)
