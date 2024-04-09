import { PreSaleStatus, PreSaleToken } from './types'

export const preSaleTokens: PreSaleToken[] = [
  {
    // FIXME: make active upon launch
    status: PreSaleStatus.NOT_STARTED,
    symbol: 'hyETH',
    logo: '/assets/eth2x.png',
    infoLink:
      'https://gov.indexcoop.com/t/iip-xxx-launch-the-high-yield-eth-index-hyeth-pre-sale/4764',
    description:
      'The Index Coop High Yield ETH Index (hyETH) tracks high-yield opportunities for ETH on Ethereum mainnet.',
    componentsFrom: ['Pendle', 'Instadapp', 'Across'],
    prtRewards: '3,000 / 10,000',
    indexRewards: 1.67,
    targetFundraise: 500,
    totalValueLocked: 658,
    timeLeftDays: 12,
    timestampEndDate: 1715356800000,
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
