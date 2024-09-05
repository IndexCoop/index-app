import { ArrowDownIcon } from '@chakra-ui/icons'
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
      <div className='dark:bg-ic-white bg-ic-black z-10 -my-4 flex h-8 w-8 rounded-full p-2'>
        <ArrowDownIcon className='dark:text-ic-black text-ic-white' />
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
    <div className='text-ic-black dark:text-ic-white border-ic-gray-100 my-2 flex w-full flex-row items-center justify-between rounded-2xl border px-3 py-4 dark:border-[#3A6060]'>
      <div className='flex items-center'>
        <div className='mx-2 flex'>
          <Image src={icon} alt={'token icon'} width={32} height={32} />
        </div>
        <span className='font-medium'>{symbol}</span>
      </div>
      <span className='text-lg font-medium'>{amount}</span>
    </div>
  )
}
