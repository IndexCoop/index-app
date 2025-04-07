import ArrowDownIcon from '@heroicons/react/20/solid/ArrowDownIcon'
import Image from 'next/image'

type FromToProps = {
  inputToken: string
  inputTokenAmount: string
  inputTokenSymbol: string
  outputToken: string
  outputTokenAmount: string
  outputTokenSymbol: string
}

export const FromTo = (props: FromToProps) => {
  return (
    <div className='flex w-full flex-col items-center'>
      <FromToItem
        amount={props.inputTokenAmount}
        icon={props.inputToken}
        symbol={props.inputTokenSymbol}
      />
      <div className='bg-ic-black z-10 -my-4 flex h-8 w-8 rounded-full p-2 dark:bg-neutral-50'>
        <ArrowDownIcon className='text-ic-white dark:text-zinc-800' />
      </div>
      <FromToItem
        amount={props.outputTokenAmount}
        icon={props.outputToken}
        symbol={props.outputTokenSymbol}
      />
    </div>
  )
}

type FromToItemProps = {
  amount: string
  icon: string
  symbol: string
}

const FromToItem = ({ amount, icon, symbol }: FromToItemProps) => {
  return (
    <div className='text-ic-black my-2  flex w-full flex-row items-center justify-between rounded-2xl border px-3 py-4 dark:border-neutral-700 dark:text-zinc-800'>
      <div className='flex items-center'>
        <div className='mx-2 flex'>
          <Image src={icon} alt={'token icon'} width={32} height={32} />
        </div>
        <span className='font-medium dark:text-neutral-50'>{symbol}</span>
      </div>
      <span className='text-lg font-medium dark:text-neutral-50'>{amount}</span>
    </div>
  )
}
