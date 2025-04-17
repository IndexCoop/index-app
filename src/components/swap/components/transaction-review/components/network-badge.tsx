import { useNetwork } from '@/lib/hooks/use-network'

export const NetworkBadge = () => {
  const { name } = useNetwork()
  const networkName = name ?? 'Unsupported Network'
  return (
    <div className='flex flex-row items-center justify-center'>
      <p className='text-ic-black text-sm font-medium dark:text-neutral-50'>
        You are connected to
      </p>
      <div className='bg-ic-black ml-1 rounded-2xl px-2 py-[2px] dark:bg-neutral-50'>
        <p className='text-ic-white text-xs font-medium dark:text-zinc-800'>
          {networkName}
        </p>
      </div>
    </div>
  )
}
