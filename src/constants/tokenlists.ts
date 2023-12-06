import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  DAI,
  DefiPulseIndex,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  ic21,
  icETHIndex,
  IndexToken,
  MetaverseIndex,
  RETH,
  SETH2,
  STETH,
  USDC,
  USDT,
  WETH,
  WSTETH,
} from '@/constants/tokens'

// Add new currencies here as well to fetch all balances
export const currencies = [
  ETH,
  DAI,
  USDC,
  USDT,
  RETH,
  SETH2,
  STETH,
  WETH,
  WSTETH,
]

const isDevEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-staging'
// Keeping a separate list for dev/staging and production to be able to include
// indices that have not been released yet.
export const indicesTokenList = isDevEnv
  ? [
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
      IndexToken,
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
      IndexToken,
    ]
