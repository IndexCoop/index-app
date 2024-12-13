import {
  BedIndex,
  CoinDeskEthTrendIndex,
  DAI,
  DefiPulseIndex,
  ETH,
  GUSD,
  ic21,
  IndexToken,
  MetaverseIndex,
  RETH,
  SETH2,
  STETH,
  USDC,
  USDT,
  WBTC,
  WETH,
  WSTETH,
} from '@/constants/tokens'

// Add new currencies here as well to fetch all balances
export const currencies = [
  ETH,
  WETH,
  USDC,
  USDT,
  DAI,
  GUSD,
  WBTC,
  RETH,
  SETH2,
  STETH,
  WSTETH,
]

export const indicesTokenListArbitrum = [DefiPulseIndex, MetaverseIndex]

export const indicesTokenList = [
  DefiPulseIndex,
  MetaverseIndex,
  BedIndex,
  CoinDeskEthTrendIndex,
  ic21,
  IndexToken,
]
