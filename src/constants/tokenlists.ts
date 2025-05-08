import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, mainnet } from 'viem/chains'

import {
  DAI,
  ETH,
  GUSD,
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

const IndexToken = getTokenByChainAndSymbol(mainnet.id, 'INDEX')
const DPI = getTokenByChainAndSymbol(mainnet.id, 'DPI')
const hyETH = getTokenByChainAndSymbol(mainnet.id, 'hyETH')
const MVI = getTokenByChainAndSymbol(mainnet.id, 'MVI')

export const indicesTokenListArbitrum = [
  getTokenByChainAndSymbol(arbitrum.id, DPI.symbol),
  getTokenByChainAndSymbol(arbitrum.id, MVI.symbol),
  getTokenByChainAndSymbol(arbitrum.id, hyETH.symbol),
].map((token) => ({ ...token, image: token?.logoURI })) as Token[]

export const indicesTokenList = [IndexToken, DPI, MVI, hyETH].map((token) => ({
  ...token,
  image: token.logoURI,
})) as Token[]
