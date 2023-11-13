import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  DAI,
  DefiPulseIndex,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  FIXED_DAI,
  FIXED_USDC,
  GitcoinStakedETHIndex,
  ic21,
  icETHIndex,
  IndexToken,
  LeveragedRethStakingYield,
  MetaverseIndex,
  RETH,
  SETH2,
  STETH,
  USDC,
  USDT,
  WETH,
  WSETH2,
  WSTETH,
} from '@/constants/tokens'

/**
 * Currencies
 */

// Add new currencies here as well to fetch all balances
export const currencies = [
  DAI,
  USDC,
  USDT,
  RETH,
  SETH2,
  STETH,
  WETH,
  WSETH2,
  WSTETH,
]

export const mainnetCurrencyTokens = [ETH, DAI, USDC, SETH2, STETH, WETH]

/**
 * Lists
 */

const isDevEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-staging'
// Keeping a separate list for dev/staging and production to be able to include
// indices that have not been released yet.
export const indexNames = isDevEnv
  ? [
      CoinDeskEthTrendIndex,
      ic21,
      LeveragedRethStakingYield,
      DiversifiedStakedETHIndex,
      icETHIndex,
      GitcoinStakedETHIndex,
      FIXED_DAI,
      FIXED_USDC,
      DefiPulseIndex,
      MetaverseIndex,
      Ethereum2xFlexibleLeverageIndex,
      Bitcoin2xFlexibleLeverageIndex,
      BedIndex,
      IndexToken,
      WSETH2,
    ]
  : [
      CoinDeskEthTrendIndex,
      ic21,
      DiversifiedStakedETHIndex,
      icETHIndex,
      GitcoinStakedETHIndex,
      DefiPulseIndex,
      MetaverseIndex,
      Ethereum2xFlexibleLeverageIndex,
      Bitcoin2xFlexibleLeverageIndex,
      BedIndex,
      LeveragedRethStakingYield,
      IndexToken,
    ]

export const indexNamesMainnet = indexNames.filter(
  (index) =>
    index.address &&
    index.symbol !== CoinDeskEthTrendIndex.symbol &&
    index.symbol !== LeveragedRethStakingYield.symbol
)

// FlashMint specific lists
export const flashMintIndexesMainnetRedeem = indexNames.filter(
  (index) =>
    index.address &&
    index.symbol !== IndexToken.symbol &&
    index.symbol !== ic21.symbol
)

export default indexNames
