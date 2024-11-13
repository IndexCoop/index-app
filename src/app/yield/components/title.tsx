import { useYieldContext } from '@/app/yield/provider'

export function Title() {
  const { indexToken } = useYieldContext()
  return (
    <div className='w-full md:max-w-md'>
      <p className='text-ic-blue-600 mb-1 text-xs font-medium sm:mb-2 sm:text-sm'>
        Index Coop
      </p>
      <h2 className='text-ic-black text-2xl font-bold sm:text-4xl'>
        {indexToken.name}
      </h2>
      <h3 className='text-ic-gray-700 my-3 text-sm font-medium leading-6 sm:text-sm'>
        {/* FIXME: Update this text or remove */}
        Ethereum’s top yield opportunities.
      </h3>
    </div>
  )
}
