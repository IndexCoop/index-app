import { Banner } from './banner'

export function SwapBanner() {
  return (
    <Banner>
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
    </Banner>
  )
}
