import Link from 'next/link'

import { Path } from '@/constants/paths'

import { Banner } from './banner'

export function LeverageBanner() {
  return (
    <Banner>
      Earn ARB rewards for bridging, LPing and buying{' '}
      <a
        href='https://app.indexcoop.com/swap/eth/mvi'
        target='_self'
        className='underline'
      >
        MVI
      </a>
      ,{' '}
      <a
        href='https://app.indexcoop.com/swap/eth/dpi'
        target='_self'
        className='underline'
      >
        DPI
      </a>
      ,{' '}
      <a
        href='https://swap.cow.fi/#/42161/swap/WETH/hyETH'
        target='_blank'
        className='underline'
      >
        hyETH
      </a>{' '}
      and our{' '}
      <Link className='underline' href={Path.LEVERAGE}>
        Leverage Tokens
      </Link>{' '}
      on <b>Arbitrum.</b> FAQ and reward tracking{' '}
      <a
        href='https://indexcoop.com/blog/arb-rewards-faq'
        target='_blank'
        className='underline'
      >
        here
      </a>
      {'.'}
    </Banner>
  )
}
