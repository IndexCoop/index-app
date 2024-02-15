import Link from 'next/link'

export function Banner() {
  return (
    <div className='flex justify-center bg-[#693798] p-3'>
      <p className='text-sm font-semibold text-ic-white'>
        +++ Holding FLI’s?{' '}
        <Link className='underline' href={'/swap/eth2x-fli/eth2x'}>
          Click here
        </Link>{' '}
        to unwrap for the new 2x Tokens! 🎁 +++
      </p>
    </div>
  )
}
