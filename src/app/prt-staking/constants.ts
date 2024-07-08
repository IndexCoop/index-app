import { getIndexTokenData } from '@indexcoop/tokenlists'

import { ProductRevenueToken } from '@/app/prt-staking/types'

export const prts: ProductRevenueToken[] = [
  {
    tokenData: getIndexTokenData('hyETH')!,
    prtTokenData: getIndexTokenData('prtHyETH')!,
    description:
      'Designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet.',
    moreInfoUrl: 'https://indexcoop.com/products/high-yield-eth',
  },
]
