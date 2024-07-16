import { Banner } from './banner'

export function LeverageBanner() {
  return (
    <Banner>
      Due to an ongoing exploit in the Li.Fi ecosystem, swaps are temporarily
      disabled. Please make sure to revoke approvals for{' '}
      <a
        href='https://x.com/lifiprotocol/status/1813196697641570635'
        target='_blank'
        className='underline'
      >
        these Li.Fi addresses.
      </a>{' '}
      Flash Minting is not affected.
    </Banner>
  )
}
