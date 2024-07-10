import { getIndexTokenData } from '@indexcoop/tokenlists'

import { ProductRevenueToken } from '@/app/prt-staking/types'

export const prts: ProductRevenueToken[] = [
  {
    rewardTokenData: getIndexTokenData('hyETH')!,
    stakeTokenData: getIndexTokenData('prtHyETH')!,
    stakedTokenData: {
      // FIXME: Use staked token once deployed
      ...getIndexTokenData('prtHyETH')!,
      address: '0x2881cc01aAD96C70319f308906D49c3784112E0D',
    },
    description:
      'Designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet.',
    moreInfoUrl: 'https://indexcoop.com/products/high-yield-eth',
  },
]
