import Link from 'next/link'

export function Banner() {
  return (
    <div className='bg-[#693798] flex justify-center p-3'>
      <p className='text-ic-white text-sm font-semibold'>
        +++ Holding FLI’s?{' '}
        <Link className='underline' href={'/swap/eth2x-fli/eth'}>
          Click here
        </Link>{' '}
        to upgrade to the new Leverage Tokens! +++
      </p>
    </div>
  )
}
