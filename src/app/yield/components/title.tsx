import { useYieldContext } from '@/app/yield/provider'

export function Title() {
  const { indexToken } = useYieldContext()
  return (
    <div className='w-full sm:max-w-md md:max-w-xl'>
      <p className='text-ic-blue-600 mb-1 text-xs font-medium sm:mb-2 sm:text-sm'>
        Index Coop
      </p>
      <h2 className='text-ic-black text-2xl font-bold sm:text-3xl'>
        {indexToken.name}
      </h2>
      <h3 className='text-ic-gray-700 my-2 text-sm font-medium leading-6 sm:my-3 sm:text-sm'>
        Ethereum’s top yield opportunities.
      </h3>
    </div>
  )
}
