import { BigNumber } from '@ethersproject/bignumber'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DAI,
  DataIndex,
  DefiPulseIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IEthereumFLIP,
  IMaticFLIP,
  IndexToken,
  MATIC,
  Matic2xFLIP,
  MetaverseIndex,
  Token,
  USDC,
  WETH,
} from 'constants/tokens'
import { useBalances } from 'hooks/useBalances'

export const useTokenBalance = (token: Token): BigNumber | undefined => {
  const {
    ethBalance,
    ethFliBalance,
    ethFliPBalance,
    bedBalance,
    btcFliBalance,
    daiBalance,
    dataBalance,
    dpiBalance,
    gmiBalance,
    indexBalance,
    maticBalance,
    mviBalance,
    usdcBalance,
    wethBalance,
  } = useBalances()

  // TODO: add missing tokens
  switch (token.symbol) {
    case BedIndex.symbol:
      return bedBalance
    case Bitcoin2xFlexibleLeverageIndex.symbol:
      return btcFliBalance
    case DAI.symbol:
      return daiBalance
    case DataIndex.symbol:
      return dataBalance
    case DefiPulseIndex.symbol:
      return dpiBalance
    case ETH.symbol:
      return ethBalance
    case Ethereum2xFlexibleLeverageIndex.symbol:
      return ethFliBalance
    case Ethereum2xFLIP.symbol:
      return ethFliPBalance
    case GmiIndex.symbol:
      return gmiBalance
    case IndexToken.symbol:
      return indexBalance
    case MATIC.symbol:
      return maticBalance
    case MetaverseIndex.symbol:
      return mviBalance
    case USDC.symbol:
      return usdcBalance
    case WETH.symbol:
      return wethBalance
    default:
      return undefined
  }
}
