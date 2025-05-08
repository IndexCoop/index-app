import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import {
  DAI,
  DefiPulseIndex,
  ETH,
  GUSD,
  IndexToken,
  MetaverseIndex,
  RETH,
  SETH2,
  STETH,
  type Token,
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

const hyETH = getTokenByChainAndSymbol(mainnet.id, 'hyETH')
const icUSD = getTokenByChainAndSymbol(base.id, 'icUSD')

export const indicesTokenListArbitrum = [
  getTokenByChainAndSymbol(arbitrum.id, DefiPulseIndex.symbol),
  getTokenByChainAndSymbol(arbitrum.id, MetaverseIndex.symbol),
  getTokenByChainAndSymbol(arbitrum.id, hyETH.symbol),
].map((token) => ({ ...token, image: token?.logoURI })) as Token[]

export const indicesTokenListBase = [
  getTokenByChainAndSymbol(base.id, hyETH.symbol),
  icUSD,
].map((token) => ({ ...token, image: token?.logoURI })) as Token[]

export const indicesTokenList = [
  IndexToken,
  DefiPulseIndex,
  MetaverseIndex,
  { ...hyETH, image: hyETH.logoURI },
  { ...icUSD, image: icUSD.logoURI },
] as Token[]
