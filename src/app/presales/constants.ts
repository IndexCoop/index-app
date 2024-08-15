import {
  HighYieldETHIndex,
  RealWorldAssetIndex,
  Token,
} from '@/constants/tokens'

import { PreSaleStatus, PreSaleToken } from './types'

export const preSaleTokens: PreSaleToken[] = [
  {
    status: PreSaleStatus.CLOSED_TARGET_NOT_MET,
    symbol: RealWorldAssetIndex.symbol,
    address: RealWorldAssetIndex.address,
    decimals: RealWorldAssetIndex.decimals,
    logo: RealWorldAssetIndex.image,
    description:
      'The Fortunafi Real World Assets Index (RWA) allows token holders to gain diversified exposure to projects and protocols that concentrate on tokenizing offchain assets.',
    componentsFrom: ['MKR', 'ONDO', 'ENA', 'CFG', 'CANTO', 'MPL'],
    infoLink: 'https://indexcoop.com/blog/previewing-rwa-index-presale',
    prtRewards: '10,000 / 100,000',
    targetFundraise: 500,
    timestampEndDate: 1721404800000,
    tvlLockedPresale: '14.08 wstETH',
  },
  {
    status: PreSaleStatus.TOKEN_LAUNCHED,
    symbol: HighYieldETHIndex.symbol,
    address: HighYieldETHIndex.address,
    decimals: HighYieldETHIndex.decimals,
    logo: HighYieldETHIndex.image,
    infoLink:
      'https://gov.indexcoop.com/t/iip-xxx-launch-the-high-yield-eth-index-hyeth-pre-sale/4764',
    description:
      'The Index Coop High Yield ETH Index (hyETH) tracks high-yield opportunities for ETH on Ethereum mainnet.',
    componentsFrom: ['Pendle', 'Instadapp', 'Across'],
    prtRewards: '3,000 / 10,000',
    targetFundraise: 500,
    launchDate: 'June 10th, 2024',
    timestampEndDate: 1715356800000,
  },
]

export function getTokenForPresaleToken(
  presaleToken: PreSaleToken | null,
): Token {
  if (presaleToken?.symbol === RealWorldAssetIndex.symbol) {
    return RealWorldAssetIndex
  }
  return HighYieldETHIndex
}

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
