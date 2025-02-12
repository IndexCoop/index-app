import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base } from 'viem/chains'

import {
  CoinDeskEthTrendIndex,
  DAI,
  DefiPulseIndex,
  ETH,
  GUSD,
  HighYieldETHIndex,
  IndexToken,
  MetaverseIndex,
  RETH,
  SETH2,
  STETH,
  Token,
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

const icUSD = getTokenByChainAndSymbol(base.id, 'icUSD')

export const indicesTokenListArbitrum = [
  getTokenByChainAndSymbol(arbitrum.id, DefiPulseIndex.symbol),
  getTokenByChainAndSymbol(arbitrum.id, MetaverseIndex.symbol),
  getTokenByChainAndSymbol(arbitrum.id, HighYieldETHIndex.symbol),
].map((token) => ({ ...token, image: token?.logoURI })) as Token[]

export const indicesTokenListBase = [
  getTokenByChainAndSymbol(base.id, HighYieldETHIndex.symbol),
  icUSD,
].map((token) => ({ ...token, image: token?.logoURI })) as Token[]

export const indicesTokenList = [
  IndexToken,
  DefiPulseIndex,
  MetaverseIndex,
  CoinDeskEthTrendIndex,
  HighYieldETHIndex,
  { ...icUSD, image: icUSD.logoURI },
] as Token[]
