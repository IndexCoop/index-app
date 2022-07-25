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
import { IndexToken } from 'constants/tokens'
import { SetProtocolViewerAbi } from 'utils/abi/SetProtocolViewer'

import { ERC20_ABI } from './abi/ERC20'
import { PerpV2LeverageModuleViewerABI } from './abi/PerpV2LeverageModuleViewerABI'

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

// For PerpV2LeverageModuleViewerWrapper
export type VAssetDisplayInfo = {
  symbol: string
  vAssetAddress: string
  positionUnit: BigNumber // 10^18 decimals
  indexPrice: BigNumber // 10^18 decimals
  currentLeverageRatio: BigNumber // 10^18 decimals
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

export async function getSetPerps(
  provider: any,
  tokenAddress: string
): Promise<VAssetDisplayInfo[]> {
  const perpV2BasisTradingViewer = new Contract(
    perpV2BasisTradingModuleViewerOptimismAddress,
    PerpV2LeverageModuleViewerABI,
    provider
  )
  return await perpV2BasisTradingViewer.getVirtualAssetsDisplayInfoAsync(
    tokenAddress
  )
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

  try {
    const setDetails: SetDetails[] = await contract.batchFetchDetails(
      productAddresses,
      moduleAddresses
    )
    return setDetails
  } catch (error) {
    console.log('Error fetching set details for chain id', chainId)
    return []
  }
}

export async function getTokenSupply(
  setTokenAddress: string,
  provider: JsonRpcProvider,
  chainId: number
) {
  if (setTokenAddress === IndexToken.address) {
    const indexContract = new Contract(setTokenAddress, ERC20_ABI, provider)
    const supply = await indexContract.totalSupply()
    return supply
  }
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
  return setDetails.totalSupply
}

// function getSet(ethersProvider: any, chainId: number): Set {
//   let set
//   switch (chainId) {
//     case OPTIMISM.chainId:
//       set = new Set({
//         ethersProvider: ethersProvider,
//         basicIssuanceModuleAddress: basicIssuanceModuleOptimismAddress,
//         controllerAddress: controllerAddress,
//         masterOracleAddress: masterOracleAddress,
//         navIssuanceModuleAddress: navIssuanceModuleAddress,
//         protocolViewerAddress: protocolViewerOptimismAddress,
//         setTokenCreatorAddress: setTokenCreatorAddress,
//         streamingFeeModuleAddress: streamingFeeModuleOptimismAddress,
//         tradeModuleAddress: tradeModuleOptimismAddress,
//         governanceModuleAddress: governanceModuleAddress,
//         debtIssuanceModuleAddress: debtIssuanceModuleAddress,
//         debtIssuanceModuleV2Address: debtIssuanceModuleV2OptimismAddress,
//         slippageIssuanceModuleAddress: slippageIssuanceModuleOptimismAddress,
//         perpV2BasisTradingModuleAddress:
//           perpV2BasisTradingModuleOptimismAddress,
//         perpV2BasisTradingModuleViewerAddress:
//           perpV2BasisTradingModuleViewerOptimismAddress,
//         perpV2LeverageModuleAddress: perpV2BasisTradingModuleOptimismAddress,
//         perpV2LeverageModuleViewerAddress:
//           perpV2LeverageModuleViewerOptimismAddress,
//         delegatedManagerFactoryAddress: delegatedManagerFactoryOptimismAddress,
//         issuanceExtensionAddress: issuanceExtensionOptimismAddress,
//         streamingFeeExtensionAddress: streamingFeeExtensionOptimismAddress,
//         tradeExtensionAddress: tradeExtensionOptimismAddress,
//         batchTradeExtensionAddress: basicIssuanceModuleOptimismAddress,
//       })
//       break
//     case POLYGON.chainId:
//       set = new Set({
//         ethersProvider: ethersProvider,
//         basicIssuanceModuleAddress: basicIssuanceModulePolygonAddress,
//         controllerAddress: controllerAddress,
//         masterOracleAddress: masterOracleAddress,
//         navIssuanceModuleAddress: navIssuanceModuleAddress,
//         protocolViewerAddress: protocolViewerPolygonAddress,
//         setTokenCreatorAddress: setTokenCreatorAddress,
//         streamingFeeModuleAddress: streamingFeeModulePolygonAddress,
//         tradeModuleAddress: tradeModulePolygonAddress,
//         governanceModuleAddress: governanceModuleAddress,
//         debtIssuanceModuleAddress: debtIssuanceModuleAddress,
//         debtIssuanceModuleV2Address: debtIssuanceModuleV2PolygonAddress,
//         slippageIssuanceModuleAddress: slippageIssuanceModuleAddress,
//         perpV2BasisTradingModuleAddress:
//           perpV2BasisTradingModuleOptimismAddress,
//         perpV2BasisTradingModuleViewerAddress:
//           perpV2BasisTradingModuleViewerOptimismAddress,
//         perpV2LeverageModuleAddress: perpV2BasisTradingModuleOptimismAddress,
//         perpV2LeverageModuleViewerAddress:
//           perpV2LeverageModuleViewerOptimismAddress,
//         delegatedManagerFactoryAddress: delegatedManagerFactoryOptimismAddress,
//         issuanceExtensionAddress: issuanceExtensionOptimismAddress,
//         streamingFeeExtensionAddress: streamingFeeExtensionOptimismAddress,
//         tradeExtensionAddress: tradeExtensionOptimismAddress,
//         batchTradeExtensionAddress: basicIssuanceModulePolygonAddress,
//       })
//       break
//     default:
//       set = new Set({
//         ethersProvider: ethersProvider,
//         basicIssuanceModuleAddress: basicIssuanceModuleAddress,
//         controllerAddress: controllerAddress,
//         masterOracleAddress: masterOracleAddress,
//         navIssuanceModuleAddress: navIssuanceModuleAddress,
//         protocolViewerAddress: protocolViewerAddress,
//         setTokenCreatorAddress: setTokenCreatorAddress,
//         streamingFeeModuleAddress: streamingFeeModuleAddress,
//         tradeModuleAddress: tradeModuleAddress,
//         governanceModuleAddress: governanceModuleAddress,
//         debtIssuanceModuleAddress: debtIssuanceModuleAddress,
//         debtIssuanceModuleV2Address: debtIssuanceModuleAddress,
//         slippageIssuanceModuleAddress: slippageIssuanceModulePolygonAddress,
//         perpV2BasisTradingModuleAddress:
//           perpV2BasisTradingModuleOptimismAddress,
//         perpV2BasisTradingModuleViewerAddress:
//           perpV2BasisTradingModuleViewerOptimismAddress,
//         perpV2LeverageModuleAddress: perpV2BasisTradingModuleOptimismAddress,
//         perpV2LeverageModuleViewerAddress:
//           perpV2LeverageModuleViewerOptimismAddress,
//         delegatedManagerFactoryAddress: delegatedManagerFactoryOptimismAddress,
//         issuanceExtensionAddress: issuanceExtensionOptimismAddress,
//         streamingFeeExtensionAddress: streamingFeeExtensionOptimismAddress,
//         tradeExtensionAddress: tradeExtensionOptimismAddress,
//         batchTradeExtensionAddress: basicIssuanceModuleAddress,
//       })
//   }
//   return set
// }
