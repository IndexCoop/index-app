import { getIndexTokenData } from '@indexcoop/tokenlists'

import { ProductRevenueToken } from '@/app/prt-staking/types'

export const prts: ProductRevenueToken[] = [
  {
    rewardTokenData: {
      ...getIndexTokenData('hyETH')!,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    stakeTokenData: {
      ...getIndexTokenData('prtHyETH')!,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    stakedTokenData: {
      ...getIndexTokenData('sPrtHyETH')!,
      address: '0x52cEeDd6d765e69C6ec20321Aa49956872913886',
    },
    description:
      'Designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet.',
    moreInfoUrl: 'https://indexcoop.com/products/high-yield-eth',
  },
]
