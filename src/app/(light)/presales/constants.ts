import {
  HighYieldETHIndex,
  ICUSD,
  RealWorldAssetIndex,
  Token,
} from '@/constants/tokens'

import { PreSaleStatus, PreSaleToken } from './types'

export const preSaleTokens: PreSaleToken[] = [
  // {
  //   status: PreSaleStatus.NOT_STARTED,
  //   symbol: ICUSD.symbol,
  //   address: ICUSD.address,
  //   decimals: ICUSD.decimals,
  //   logo: ICUSD.image,
  //   // TODO: Fix and uncomment link once blog post is live
  //   // infoLink: 'https://indexcoop.com/blog/introducing-usdc-yield-index',
  //   description:
  //     'The USDC Yield Index (icUSD) tracks the USDC DeFi Yield Index from Chainlink to provide yield from the top USDC lending opportunities on Ethereum.',
  //   componentsFrom: ['AAVE', 'Compound'],
  //   prtRewards: '10,000 / 100,000',
  //   targetFundraise: { quantity: '$2,000,000', asset: 'aUSDC' },
  //   timestampEndDate: 1728964800000,
  //   startDate: 'TBD',
  // },
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
    targetFundraise: { quantity: '500', asset: 'wstETH' },
    launchDate: 'June 10th, 2024',
    timestampEndDate: 1715356800000,
  },
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
    targetFundraise: { quantity: '500', asset: 'wstETH' },
    timestampEndDate: 1721404800000,
    tvlLockedPresale: '14.08 wstETH',
  },
]

export function getTokenForPresaleToken(
  presaleToken: PreSaleToken | null,
): Token | null {
  if (presaleToken?.symbol === RealWorldAssetIndex.symbol) {
    return RealWorldAssetIndex
  }
  if (presaleToken?.symbol === HighYieldETHIndex.symbol) {
    return HighYieldETHIndex
  }
  if (presaleToken?.symbol === ICUSD.symbol) {
    return ICUSD
  }
  return null
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
