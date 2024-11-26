import { useEarnContext } from '@/app/earn/provider'

export function Title() {
  const { indexToken } = useEarnContext()
  return (
    <div className='w-full sm:max-w-md md:max-w-xl'>
      <p className='text-ic-blue-600 mb-1 text-xs font-medium sm:mb-2 sm:text-sm'>
        Index Coop
      </p>
      <h2 className='text-ic-black text-2xl font-bold sm:text-3xl'>
        {indexToken.name}
      </h2>
    </div>
  )
}
