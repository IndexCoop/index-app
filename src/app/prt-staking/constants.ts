import { getTokenByChainAndSymbol } from '@nsorcell/exp-tokenlist'

import { ProductRevenueToken } from '@/app/prt-staking/types'

export const prts: ProductRevenueToken[] = [
  {
    rewardTokenData: getTokenByChainAndSymbol(1, 'hyETH'),
    stakeTokenData: getTokenByChainAndSymbol(1, 'prtHyETH'),
    stakedTokenData: getTokenByChainAndSymbol(1, 'sPrtHyETH'),
    description:
      'Designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet.',
    moreInfoUrl: 'https://indexcoop.com/products/high-yield-eth',
  },
]
