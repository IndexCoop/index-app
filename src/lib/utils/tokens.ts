import { MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  Bitcoin2xFlexibleLeverageIndex,
  DAI,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  FIXED_DAI,
  FIXED_USDC,
  flashMintIndexesMainnetRedeem,
  flashMintIndexesPolygonRedeem,
  GitcoinStakedETHIndex,
  icETHIndex,
  IndexToken,
  LeveragedRethStakingYield,
  mainnetCurrencyTokens,
  MATIC,
  MoneyMarketIndex,
  optimismCurrencyTokens,
  polygonCurrencyTokens,
  RETH,
  SETH2,
  STETH,
  Token,
  USDC,
  USDT,
  WETH,
  WSTETH,
} from '@/constants/tokens'

export function getAddressForToken(
  token: Token,
  chainId: number | undefined
): string | undefined {
  if (token.symbol === IndexToken.symbol) return token.address
  switch (chainId) {
    case MAINNET.chainId:
      return token.address
    case OPTIMISM.chainId:
      return token.optimismAddress
    case POLYGON.chainId:
      return token.polygonAddress
    default:
      return undefined
  }
}

/**
 * Gets the list of currency tokens for the selected chain.
 * @returns Token[] list of tokens
 */
export function getCurrencyTokens(chainId: number | undefined): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
      return mainnetCurrencyTokens
    case OPTIMISM.chainId:
      return optimismCurrencyTokens
    case POLYGON.chainId:
      return polygonCurrencyTokens
    default:
      return []
  }
}

/**
 * Gets the supported currency tokens for the given index.
 * @returns Token[] list of supported currency tokens
 */
export function getCurrencyTokensForIndex(
  index: Token,
  chainId: number,
  isMinting: boolean
): Token[] {
  if (index.symbol === FIXED_DAI.symbol) return [DAI]
  if (index.symbol === FIXED_USDC.symbol) return [USDC]
  if (index.symbol === icETHIndex.symbol)
    return isMinting ? [ETH, STETH] : [ETH]
  if (
    index.symbol === DiversifiedStakedETHIndex.symbol ||
    index.symbol === GitcoinStakedETHIndex.symbol
  )
    return [ETH, WETH, STETH, WSTETH, RETH, SETH2, USDC]
  if (index.symbol === LeveragedRethStakingYield.symbol)
    return [ETH, WETH, RETH, USDC]
  if (index.symbol === MoneyMarketIndex.symbol) return [DAI, USDC, USDT, WETH]
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

export function getNativeToken(chainId: number | undefined): Token | null {
  switch (chainId) {
    case MAINNET.chainId:
      return ETH
    case OPTIMISM.chainId:
      return ETH
    case POLYGON.chainId:
      return MATIC
    default:
      return null
  }
}

export function isLeveragedToken(token: Token): boolean {
  if (token === Bitcoin2xFlexibleLeverageIndex) return true
  if (token === Ethereum2xFlexibleLeverageIndex) return true
  if (token === icETHIndex) return true
  return false
}

export const isNativeCurrency = (token: Token, chainId: number): boolean => {
  const nativeCurrency = getNativeToken(chainId)
  if (!nativeCurrency) return false
  return token.symbol === nativeCurrency.symbol
}

export function isPerpToken(token: Token): boolean {
  return token.isPerp ? true : false
}

export function isTokenAvailableForFlashMint(
  token: Token,
  chainId: number | undefined
): boolean {
  if (!chainId) return false
  if (token.symbol === IndexToken.symbol) return false
  switch (chainId) {
    case MAINNET.chainId:
      return (
        flashMintIndexesMainnetRedeem.filter((t) => t.symbol === token.symbol)
          .length > 0
      )
    case POLYGON.chainId:
      return (
        flashMintIndexesPolygonRedeem.filter((t) => t.symbol === token.symbol)
          .length > 0
      )
    default:
      return false
  }
}
