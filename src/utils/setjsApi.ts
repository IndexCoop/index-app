import { BigNumber, Contract } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import { OPTIMISM, POLYGON } from 'constants/chains'
import {
  basicIssuanceModuleAddress,
  basicIssuanceModuleOptimismAddress,
  basicIssuanceModulePolygonAddress,
  debtIssuanceModuleAddress,
  debtIssuanceModuleV2Address,
  debtIssuanceModuleV2OptimismAddress,
  debtIssuanceModuleV2PolygonAddress,
  perpV2BasisTradingModuleOptimismAddress,
  perpV2BasisTradingModuleViewerOptimismAddress,
  perpV2LeverageModuleOptimismAddress,
  perpV2LeverageModuleViewerOptimismAddress,
  protocolViewerAddress,
  protocolViewerOptimismAddress,
  protocolViewerPolygonAddress,
  slippageIssuanceModuleOptimismAddress,
  streamingFeeModuleAddress,
  streamingFeeModuleOptimismAddress,
  streamingFeeModulePolygonAddress,
  tradeModuleAddress,
  tradeModuleOptimismAddress,
  tradeModulePolygonAddress,
} from 'constants/ethContractAddresses'
import { MNYeIndex } from 'constants/tokens'
import { SetProtocolViewerAbi } from 'utils/abi/SetProtocolViewer'

/**
 * Utils types of Set.
 *
 * https://github.com/SetProtocol/set.js/blob/master/src/types/utils.ts
 */

export type CurrencyCodePriceMap = {
  [key: string]: number
}

export type CoinGeckoCoinPrices = {
  [key: string]: CurrencyCodePriceMap
}

/**
 * Common types of Set.
 *
 * https://github.com/SetProtocol/set.js/blob/master/src/types/common.ts
 */

export type Position = {
  component: string
  module: string
  unit: BigNumber
  positionState: number
  data: string
}

export type SetDetails = {
  name: string
  symbol: string
  manager: string
  modules: string[]
  moduleStatuses: number[]
  positions: Position[]
  totalSupply: BigNumber
}

export function getModuleAddresses(chainId: number): string[] {
  switch (chainId) {
    case OPTIMISM.chainId:
      return [
        basicIssuanceModuleOptimismAddress,
        streamingFeeModuleOptimismAddress,
        tradeModuleOptimismAddress,
        debtIssuanceModuleV2OptimismAddress,
        slippageIssuanceModuleOptimismAddress,
        perpV2BasisTradingModuleOptimismAddress,
        perpV2LeverageModuleOptimismAddress,
        perpV2BasisTradingModuleViewerOptimismAddress,
        perpV2LeverageModuleViewerOptimismAddress,
      ]
    case POLYGON.chainId:
      return [
        basicIssuanceModulePolygonAddress,
        streamingFeeModulePolygonAddress,
        tradeModulePolygonAddress,
        debtIssuanceModuleV2PolygonAddress,
      ]
    default:
      return [
        basicIssuanceModuleAddress,
        streamingFeeModuleAddress,
        tradeModuleAddress,
        debtIssuanceModuleAddress,
        debtIssuanceModuleV2Address,
      ]
  }
}

// https://docs.tokensets.com/developers/contracts/deployed/protocol#core-contracts
export function getProtocolViewerAddress(chainId: number): string {
  switch (chainId) {
    case OPTIMISM.chainId:
      return protocolViewerOptimismAddress
    case POLYGON.chainId:
      return protocolViewerPolygonAddress
    default:
      return protocolViewerAddress
  }
}

export async function getSetDetails(
  ethersProvider: JsonRpcProvider,
  productAddresses: string[],
  chainId: number,
  isPerp: boolean = false
): Promise<SetDetails[]> {
  console.log('getSetDetails')
  const protocolViewerAddress = getProtocolViewerAddress(chainId)
  const contract = new Contract(
    protocolViewerAddress,
    SetProtocolViewerAbi,
    ethersProvider
  )
  const moduleAddresses = getModuleAddresses(chainId)

  /**
   * TODO: This isn't needed for the short term, but long term we need to account for all positions in NAV calcs + when showing positions on the allocations page.
   * This is how you get Perpetual Protocol products to show their full positions. For now will just log them, but they need to be added to the allocations list.
   */
  // if (isPerp) {
  //   try {
  //     const address = MNYeIndex.optimismAddress || ''
  //     const arr =
  //       await set.perpV2BasisTradingViewer.getVirtualAssetsDisplayInfoAsync(
  //         address,
  //         ethersProvider.address
  //       )
  //
  //     const arr2 =
  //       await set.perpV2LeverageViewer.getVirtualAssetsDisplayInfoAsync(
  //         address,
  //         ethersProvider.address
  //       )
  //   } catch (e) {
  //     console.log('PERP error', e)
  //   }
  // }

  const setDetails: SetDetails[] = await contract.batchFetchDetails(
    productAddresses,
    moduleAddresses
  )
  return setDetails
}

export async function getTokenSupply(
  setTokenAddress: string,
  provider: JsonRpcProvider,
  chainId: number
) {
  const protocolViewerAddress = getProtocolViewerAddress(chainId)
  const contract = new Contract(
    protocolViewerAddress,
    SetProtocolViewerAbi,
    provider
  )
  const moduleAddresses = getModuleAddresses(chainId)
  const setDetails: SetDetails = await contract.getSetDetails(
    setTokenAddress,
    moduleAddresses
  )
  console.log(setDetails)
  return setDetails.totalSupply
}
