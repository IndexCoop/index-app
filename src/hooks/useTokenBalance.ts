import { BigNumber } from '@ethersproject/bignumber'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  Bitcoin2xFLIP,
  DAI,
  DataIndex,
  DefiPulseIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IBitcoinFLIP,
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
    btc2xFLIPBalance,
    daiBalance,
    dataBalance,
    dpiBalance,
    gmiBalance,
    iEthFLIPbalance,
    iMaticFLIPbalance,
    indexBalance,
    iBtcFLIPBalance,
    matic2xFLIPbalance,
    maticBalance,
    mviBalance,
    usdcBalance,
    wethBalance,
  } = useBalances()

  switch (token.symbol) {
    case BedIndex.symbol:
      return bedBalance
    case Bitcoin2xFlexibleLeverageIndex.symbol:
      return btcFliBalance
    case Bitcoin2xFLIP.symbol:
      return btc2xFLIPBalance
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
    case IBitcoinFLIP.symbol:
      return iBtcFLIPBalance
    case IEthereumFLIP.symbol:
      return iEthFLIPbalance
    case IMaticFLIP.symbol:
      return iMaticFLIPbalance
    case IndexToken.symbol:
      return indexBalance
    case MATIC.symbol:
      return maticBalance
    case Matic2xFLIP.symbol:
      return matic2xFLIPbalance
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
