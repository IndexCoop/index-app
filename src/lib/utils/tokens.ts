import { ARBITRUM, BASE, MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  currencies,
  indicesTokenList,
  indicesTokenListArbitrum,
} from '@/constants/tokenlists'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  DAI,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  GUSD,
  icETHIndex,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum2xIndex,
  IndexToken,
  LeveragedRethStakingYield,
  MATIC,
  RealWorldAssetIndex,
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

export function getAddressForToken(
  token: Token,
  chainId: number | undefined,
): string | undefined {
  if (token.symbol === IndexToken.symbol) return token.address
  switch (chainId) {
    case ARBITRUM.chainId:
      return token.arbitrumAddress
    case BASE.chainId:
      return token.baseAddress
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
      return currencies
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
): Token[] {
  if (chainId === ARBITRUM.chainId) {
    return [ETH, WETH, WBTC, USDC, USDT]
  }
  if (chainId === BASE.chainId) {
    return [ETH, WETH, USDC]
  }
  if (index.symbol === CoinDeskEthTrendIndex.symbol)
    return [ETH, WETH, USDC, DAI, GUSD]
  if (index.symbol === icETHIndex.symbol) return [ETH, WETH, STETH]
  if (
    index.symbol === DiversifiedStakedETHIndex.symbol ||
    index.symbol === GitcoinStakedETHIndex.symbol
  )
    return [ETH, WETH, USDC, GUSD, RETH, STETH, SETH2, WSTETH]
  if (index.symbol === LeveragedRethStakingYield.symbol)
    return [ETH, WETH, USDC, GUSD, RETH]
  const currencyTokens = getCurrencyTokens(chainId)
  if (index.symbol === Bitcoin2xFlexibleLeverageIndex.symbol) {
    return [IndexCoopBitcoin2xIndex, ...currencyTokens]
  }
  if (index.symbol === Ethereum2xFlexibleLeverageIndex.symbol) {
    return [IndexCoopEthereum2xIndex, ...currencyTokens]
  }
  return currencyTokens
}

export function getDefaultIndex(chainId: number = 1): Token {
  if (chainId === ARBITRUM.chainId) return indicesTokenListArbitrum[0]
  return indicesTokenList[0]
}

export function getNativeToken(chainId: number | undefined): Token | null {
  switch (chainId) {
    case ARBITRUM.chainId:
      return ETH
    case BASE.chainId:
      return ETH
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

export function getTokenBySymbol(symbol: string): Token | null {
  const indexToken = indicesTokenList.find(
    (index) => index.symbol.toLowerCase() === symbol.toLowerCase(),
  )
  if (indexToken) {
    return indexToken
  }
  const currencyToken = currencies.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  )
  return currencyToken ?? null
}

export function isAvailableForFlashMint(token: Token): boolean {
  switch (token.symbol) {
    case IndexToken.symbol:
      return false
    default:
      return true
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isAvailableForIssuance(
  inputToken: Token,
  outputToken: Token,
): boolean {
  return (
    inputToken.symbol === BedIndex.symbol ||
    inputToken.symbol === GitcoinStakedETHIndex.symbol ||
    inputToken.symbol === LeveragedRethStakingYield.symbol ||
    inputToken.symbol === RealWorldAssetIndex.symbol ||
    outputToken.symbol === RealWorldAssetIndex.symbol
  )
}

export function isAvailableForRedemption(
  inputToken: Token,
  outputToken: Token,
): boolean {
  return (
    (inputToken.symbol === Bitcoin2xFlexibleLeverageIndex.symbol &&
      outputToken.symbol === IndexCoopBitcoin2xIndex.symbol) ||
    (inputToken.symbol === Ethereum2xFlexibleLeverageIndex.symbol &&
      outputToken.symbol === IndexCoopEthereum2xIndex.symbol)
  )
}

export function isAvailableForSwap(token: Token): boolean {
  switch (token.symbol) {
    case CoinDeskEthTrendIndex.symbol:
    case IndexCoopBitcoin2xIndex.symbol:
    case LeveragedRethStakingYield.symbol:
      return false
    default:
      return true
  }
}

export function isTokenPairTradable(
  requiresProtection: boolean,
  inputToken: Token,
  outputToken: Token,
): boolean {
  if (!requiresProtection) return true
  return !inputToken.isDangerous && !outputToken.isDangerous
}
