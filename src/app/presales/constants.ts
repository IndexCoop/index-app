import { HighYieldETHIndex } from '@/constants/tokens'

import { PreSaleStatus, PreSaleToken } from './types'

export const preSaleTokens: PreSaleToken[] = [
  {
    status: PreSaleStatus.TOKEN_LAUNCHED,
    symbol: HighYieldETHIndex.symbol,
    logo: HighYieldETHIndex.image,
    infoLink:
      'https://gov.indexcoop.com/t/iip-xxx-launch-the-high-yield-eth-index-hyeth-pre-sale/4764',
    description:
      'The Index Coop High Yield ETH Index (hyETH) tracks high-yield opportunities for ETH on Ethereum mainnet.',
    componentsFrom: ['Pendle', 'Instadapp', 'Across'],
    prtRewards: '3,000 / 10,000',
    indexRewards: 1.67,
    targetFundraise: 500,
    launchDate: 'June 10th, 2024',
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
  // },
]

export const presaleChipLabels = {
  [PreSaleStatus.ACTIVE]: 'Presale active',
  [PreSaleStatus.CLOSED_TARGET_MET]: 'Presale closed, target met',
  [PreSaleStatus.CLOSED_TARGET_NOT_MET]: 'Presale closed, target not met',
  [PreSaleStatus.NOT_STARTED]: 'Coming soon',
  [PreSaleStatus.TOKEN_LAUNCHED]: 'Token launched',
}

export const presaleButtonLabels = {
  [PreSaleStatus.ACTIVE]: 'Join Presale',
  [PreSaleStatus.CLOSED_TARGET_MET]: 'Manage Deposits',
  [PreSaleStatus.CLOSED_TARGET_NOT_MET]: 'Manage Deposits',
  [PreSaleStatus.NOT_STARTED]: 'Presale not started',
  [PreSaleStatus.TOKEN_LAUNCHED]: 'Trade Now',
}
