import Link from 'next/link'

type ContractSectionProps = {
  contractAddress: string
  explorerUrl: string
}

export function ContractSection({
  contractAddress,
  explorerUrl,
}: ContractSectionProps) {
  return (
    <div className='border-ic-gray-100 text-ic-black dark:text-ic-gray-300 flex w-full flex-row justify-between rounded-2xl border p-4 dark:border-[#3A6060]'>
      <div className='text-lg font-medium'>Contract</div>
      <Link className='underline' href={explorerUrl} target='_blank'>
        {`${contractAddress.substring(0, 8)}...`}
      </Link>
    </div>
  )
}
