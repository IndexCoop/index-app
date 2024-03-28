import { PreSaleStatus, PreSaleToken } from './types'

export const preSaleTokens: PreSaleToken[] = [
  {
    status: PreSaleStatus.ACTIVE,
    symbol: 'hyETH',
    logo: '/assets/eth2x.png',
    infoLink: 'https://indexcoop.com/blog/pre-sale-prt-hyeth',
    description:
      'The Index Coop High Yield ETH Index is designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet that meet minimum APY and TVL criteria verified by data from DeFi Llama.',
    componentsFrom: ['Mantle', 'Pendle', 'Instadapp', 'Across'],
    prtRewards: 102,
    indexRewards: 1.67,
    targetFundraise: 1000,
    totalValueLocked: 658,
    timeLeftDays: 12,
  },
  // {
  //   status: PreSaleStatus.NOT_STARTED,
  //   symbol: 'icAI',
  //   description:
  //     'The Index Coop High Yield ETH Index is designed to track the performance of the largest high-yield opportunities for ETH on Ethereum mainnet that meet minimum APY and TVL criteria verified by data from DeFi Llama.',
  //   componentsFrom: ['Mantle', 'Pendle', 'Instadapp', 'Across'],
  //   prtRewards: 74,
  //   indexRewards: 1.93,
  //   targetFundraise: 1000,
  //   totalValueLocked: 0,
  //   timeLeftDays: 30,
  // },
]
