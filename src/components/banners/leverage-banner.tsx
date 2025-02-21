import Link from 'next/link'

import { Path } from '@/constants/paths'

import { Banner } from './banner'

export function LeverageBanner() {
  return (
    <Banner>
      Earn ARB rewards for{' '}
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
        href='https://app.indexcoop.com/swap/eth/hyETH'
        target='_blank'
        className='underline'
      >
        hyETH
      </a>{' '}
      and our{' '}
      <Link className='underline' href={Path.TRADE}>
        Leverage Tokens
      </Link>{' '}
      on <b>Arbitrum.</b> FAQ and rewards tracking{' '}
      <a
        href='https://indexcoop.com/product-faqs/arb-rewards-ccip-faq'
        target='_blank'
        className='underline'
      >
        here
      </a>
      {'.'}
    </Banner>
  )
}
