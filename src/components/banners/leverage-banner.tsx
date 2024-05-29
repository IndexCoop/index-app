import Link from 'next/link'

import { Path } from '@/constants/paths'

import { Banner } from './banner'

export function LeverageBanner() {
  return (
    <Banner>
      Trade on Arbitrum and earn ARB rewards now. Early users will earn 2bps /
      day in ARB on all{' '}
      <Link className='underline' href={Path.LEVERAGE}>
        Leverage Suite tokens
      </Link>{' '}
      held. Track your rewards{' '}
      <a
        href='https://dune.com/index_coop/arb-rewards'
        target='_blank'
        className='underline'
      >
        here
      </a>
      .
    </Banner>
  )
}
