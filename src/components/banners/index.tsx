
export function Banner() {
  return (
    <div className='flex justify-center bg-[#006A71] p-3'>
      <p className='text-ic-white text-sm font-semibold'>
        We are experiencing some temporary downtime for swaps via our app. To
        swap our tokens please visit{' '}
        <a className='underline' href='https://swap.cow.fi/' target='_blank'>
          https://swap.cow.fi/
        </a>
        . Flash Minting is not affected.
      </p>
    </div>
  )
}
