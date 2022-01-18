import {
  ChainId,
  useEtherBalance,
  useEthers,
  useTokenBalance,
} from '@usedapp/core'

import {
  daiTokenAddress,
  daiTokenPolygonAddress,
  usdcTokenAddress,
  usdcTokenPolygonAddress,
} from 'constants/ethContractAddresses'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  MetaverseIndex,
  ProductToken,
} from 'constants/productTokens'
import { MAINNET_CHAIN_DATA, POLYGON_CHAIN_DATA } from 'utils/connectors'

const getChainAddress = (
  token: ProductToken,
  chainId: ChainId = MAINNET_CHAIN_DATA.chainId
) => {
  if (chainId === POLYGON_CHAIN_DATA.chainId) return token.polygonAddress
  return token.address
}

const getDaiAddress = (chainId: ChainId = MAINNET_CHAIN_DATA.chainId) => {
  if (chainId === POLYGON_CHAIN_DATA.chainId) return daiTokenPolygonAddress
  return daiTokenAddress
}
const getUsdcAddress = (chainId: ChainId = MAINNET_CHAIN_DATA.chainId) => {
  if (chainId === POLYGON_CHAIN_DATA.chainId) return usdcTokenPolygonAddress
  return usdcTokenAddress
}

export const useBalances = () => {
  const { account, chainId } = useEthers()

  const daiBalance = useTokenBalance(getDaiAddress(chainId), account)
  const usdcBalance = useTokenBalance(getUsdcAddress(chainId), account)
  const dpiBalance = useTokenBalance(
    getChainAddress(DefiPulseIndex, chainId),
    account
  )
  const mviBalance = useTokenBalance(
    getChainAddress(MetaverseIndex, chainId),
    account
  )
  const bedBalance = useTokenBalance(
    getChainAddress(BedIndex, chainId),
    account
  )
  const dataBalance = useTokenBalance(
    getChainAddress(DataIndex, chainId),
    account
  )
  const gmiBalance = useTokenBalance(
    getChainAddress(GmiIndex, chainId),
    account
  )
  const ethFliBalance = useTokenBalance(
    getChainAddress(Ethereum2xFlexibleLeverageIndex, chainId),
    account
  )
  const btcFliBalance = useTokenBalance(
    getChainAddress(Bitcoin2xFlexibleLeverageIndex, chainId),
    account
  )
  const ethFliPBalance = useTokenBalance(
    getChainAddress(Ethereum2xFLIP, chainId),
    account
  )
  return {
    daiBalance,
    usdcBalance,
    dpiBalance,
    mviBalance,
    bedBalance,
    dataBalance,
    gmiBalance,
    ethFliBalance,
    btcFliBalance,
    ethFliPBalance,
  }
}
