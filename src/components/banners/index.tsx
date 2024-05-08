export function Banner() {
  return (
    <div className='flex justify-center bg-[#006A71] p-3'>
      <p className='text-ic-white text-sm font-semibold'>
        DPI and MVI are coming to Arbitrum.{' '}
        <a
          className='underline'
          href='https://app.transporter.io/?from=mainnet&to=arbitrum'
          target='_blank'
        >
          Bridge
        </a>{' '}
        your Tokens now to earn Arb rewards.{' '}
        <a
          className='underline'
          href='https://indexcoop.com/blog/dpi-and-mvi-on-arbitrum-faq'
          target='_blank'
        >
          Learn more
        </a>
      </p>
    </div>
  )
}
