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
  GUSD,
  HighYieldETHIndex,
  ic21,
  icETHIndex,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum2xIndex,
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

export const indicesTokenListArbitrum = [
  DefiPulseIndex,
  MetaverseIndex,
  HighYieldETHIndex,
]

const isDevEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-staging'
// Keeping a separate list for dev/staging and production to be able to include
// indices that have not been released yet.
export const indicesTokenList = isDevEnv
  ? [
      IndexCoopEthereum2xIndex,
      IndexCoopBitcoin2xIndex,
      CoinDeskEthTrendIndex,
      ic21,
      DiversifiedStakedETHIndex,
      icETHIndex,
      GitcoinStakedETHIndex,
      HighYieldETHIndex,
      DefiPulseIndex,
      MetaverseIndex,
      Ethereum2xFlexibleLeverageIndex,
      Bitcoin2xFlexibleLeverageIndex,
      BedIndex,
      IndexToken,
    ]
  : [
      IndexCoopEthereum2xIndex,
      IndexCoopBitcoin2xIndex,
      CoinDeskEthTrendIndex,
      ic21,
      DiversifiedStakedETHIndex,
      icETHIndex,
      GitcoinStakedETHIndex,
      HighYieldETHIndex,
      DefiPulseIndex,
      MetaverseIndex,
      Ethereum2xFlexibleLeverageIndex,
      Bitcoin2xFlexibleLeverageIndex,
      BedIndex,
      IndexToken,
    ]
