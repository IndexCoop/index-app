import { useNetwork } from '@/lib/hooks/use-network'

export const NetworkBadge = () => {
  const { name } = useNetwork()
  const networkName = name ?? 'Unsupported Network'
  return (
    <div className='flex flex-row items-center justify-center'>
      <p className='text-ic-black dark:text-ic-white text-sm font-medium'>
        You are connected to
      </p>
      <div className='bg-ic-black dark:bg-ic-white ml-1 rounded-2xl px-2 py-[2px]'>
        <p className='text-ic-white dark:text-ic-black text-xs font-medium'>
          {networkName}
        </p>
      </div>
    </div>
  )
}
