import { getIndexTokenData } from '@indexcoop/tokenlists'

import { ProductRevenueToken } from '@/app/prt-staking/types'

export const prts: ProductRevenueToken[] = [
  {
    rewardTokenData: getIndexTokenData('hyETH')!,
    stakeTokenData: getIndexTokenData('prtHyETH')!,
    stakedTokenData: getIndexTokenData('prtHyETH')!, // FIXME
    description:
      'Designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet.',
    moreInfoUrl: 'https://indexcoop.com/products/high-yield-eth',
  },
]
