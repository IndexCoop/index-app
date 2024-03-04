import Link from 'next/link'

export function Banner() {
  return (
    <div className='bg-[#693798] flex justify-center p-3'>
      <p className='text-ic-white text-sm font-semibold'>
        +++ Holding FLI’s?{' '}
        <Link className='underline' href={'/swap/eth2x-fli/eth2x'}>
          Click here
        </Link>{' '}
        to unwrap for the new 2x Tokens! 🎁 +++
      </p>
    </div>
  )
}
