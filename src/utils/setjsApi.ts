import Set from 'set.js'
import { SetDetails, StreamingFeeInfo } from 'set.js/dist/types/src/types'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  basicIssuanceModuleAddress,
  basicIssuanceModuleOptimismAddress,
  basicIssuanceModulePolygonAddress,
  controllerAddress,
  debtIssuanceModuleAddress,
  debtIssuanceModuleV2Address,
  debtIssuanceModuleV2OptimismAddress,
  debtIssuanceModuleV2PolygonAddress,
  delegatedManagerFactoryOptimismAddress,
  governanceModuleAddress,
  issuanceExtensionOptimismAddress,
  masterOracleAddress,
  navIssuanceModuleAddress,
  perpV2BasisTradingModuleOptimismAddress,
  perpV2BasisTradingModuleViewerOptimismAddress,
  perpV2LeverageModuleOptimismAddress,
  perpV2LeverageModuleViewerOptimismAddress,
  protocolViewerAddress,
  protocolViewerOptimismAddress,
  protocolViewerPolygonAddress,
  setTokenCreatorAddress,
  slippageIssuanceModuleAddress,
  slippageIssuanceModuleOptimismAddress,
  slippageIssuanceModulePolygonAddress,
  streamingFeeExtensionOptimismAddress,
  streamingFeeModuleAddress,
  streamingFeeModuleOptimismAddress,
  streamingFeeModulePolygonAddress,
  tradeExtensionOptimismAddress,
  tradeModuleAddress,
  tradeModuleOptimismAddress,
  tradeModulePolygonAddress,
} from 'constants/ethContractAddresses'
import { MNYeIndex } from 'constants/tokens'

export async function getTokenSupply(
  ethersProvider: any,
  productAddresses: string[],
  chainId: number
): Promise<SetDetails[]> {
  const set = getSet(ethersProvider, chainId)
  let moduleAddresses
  if (chainId === MAINNET.chainId) {
    moduleAddresses = [
      basicIssuanceModuleAddress,
      streamingFeeModuleAddress,
      tradeModuleAddress,
      debtIssuanceModuleAddress,
    ]
  } else {
    moduleAddresses = [
      basicIssuanceModulePolygonAddress,
      streamingFeeModulePolygonAddress,
      tradeModulePolygonAddress,
      debtIssuanceModuleV2PolygonAddress,
    ]
  }
  return await set.setToken.batchFetchSetDetailsAsync(
    productAddresses,
    moduleAddresses
  )
}

export async function getStreamingFees(
  ethersProvider: any,
  productAddresses: string[],
  chainId: number
): Promise<StreamingFeeInfo[]> {
  const set = getSet(ethersProvider, chainId)
  return set.fees.batchFetchStreamingFeeInfoAsync(productAddresses)
}

export async function getSetDetails(
  ethersProvider: any,
  productAddresses: string[],
  chainId: number,
  isPerp: boolean = false
): Promise<SetDetails[]> {
  const set = getSet(ethersProvider, chainId)
  let moduleAddresses: string[] = []
  switch (chainId) {
    case OPTIMISM.chainId:
      moduleAddresses = [
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
      break
    case POLYGON.chainId:
      moduleAddresses = [
        basicIssuanceModulePolygonAddress,
        streamingFeeModulePolygonAddress,
        tradeModulePolygonAddress,
        debtIssuanceModuleV2PolygonAddress,
      ]
      break
    default:
      moduleAddresses = [
        basicIssuanceModuleAddress,
        streamingFeeModuleAddress,
        tradeModuleAddress,
        debtIssuanceModuleAddress,
        debtIssuanceModuleV2Address,
      ]
  }

  /**
   * TODO: This isn't needed for the short term, but long term we need to account for all positions in NAV calcs + when showing positions on the allocations page.
   * This is how you get Perpetual Protocol products to show their full positions. For now will just log them, but they need to be added to the allocations list.
   */
  if (isPerp) {
    try {
      const address = MNYeIndex.optimismAddress || ''
      const arr =
        await set.perpV2BasisTradingViewer.getVirtualAssetsDisplayInfoAsync(
          address,
          ethersProvider.address
        )

      const arr2 =
        await set.perpV2LeverageViewer.getVirtualAssetsDisplayInfoAsync(
          address,
          ethersProvider.address
        )
    } catch (e) {
      console.log('PERP error', e)
    }
  }
  return set.setToken.batchFetchSetDetailsAsync(
    productAddresses,
    moduleAddresses
  )
}

function getSet(ethersProvider: any, chainId: number): Set {
  let set
  switch (chainId) {
    case OPTIMISM.chainId:
      set = new Set({
        ethersProvider: ethersProvider,
        basicIssuanceModuleAddress: basicIssuanceModuleOptimismAddress,
        controllerAddress: controllerAddress,
        masterOracleAddress: masterOracleAddress,
        navIssuanceModuleAddress: navIssuanceModuleAddress,
        protocolViewerAddress: protocolViewerOptimismAddress,
        setTokenCreatorAddress: setTokenCreatorAddress,
        streamingFeeModuleAddress: streamingFeeModuleOptimismAddress,
        tradeModuleAddress: tradeModuleOptimismAddress,
        governanceModuleAddress: governanceModuleAddress,
        debtIssuanceModuleAddress: debtIssuanceModuleAddress,
        debtIssuanceModuleV2Address: debtIssuanceModuleV2OptimismAddress,
        slippageIssuanceModuleAddress: slippageIssuanceModuleOptimismAddress,
        perpV2BasisTradingModuleAddress:
          perpV2BasisTradingModuleOptimismAddress,
        perpV2BasisTradingModuleViewerAddress:
          perpV2BasisTradingModuleViewerOptimismAddress,
        perpV2LeverageModuleAddress: perpV2BasisTradingModuleOptimismAddress,
        perpV2LeverageModuleViewerAddress:
          perpV2LeverageModuleViewerOptimismAddress,
        delegatedManagerFactoryAddress: delegatedManagerFactoryOptimismAddress,
        issuanceExtensionAddress: issuanceExtensionOptimismAddress,
        streamingFeeExtensionAddress: streamingFeeExtensionOptimismAddress,
        tradeExtensionAddress: tradeExtensionOptimismAddress,
        batchTradeExtensionAddress: basicIssuanceModuleOptimismAddress,
      })
      break
    case POLYGON.chainId:
      set = new Set({
        ethersProvider: ethersProvider,
        basicIssuanceModuleAddress: basicIssuanceModulePolygonAddress,
        controllerAddress: controllerAddress,
        masterOracleAddress: masterOracleAddress,
        navIssuanceModuleAddress: navIssuanceModuleAddress,
        protocolViewerAddress: protocolViewerPolygonAddress,
        setTokenCreatorAddress: setTokenCreatorAddress,
        streamingFeeModuleAddress: streamingFeeModulePolygonAddress,
        tradeModuleAddress: tradeModulePolygonAddress,
        governanceModuleAddress: governanceModuleAddress,
        debtIssuanceModuleAddress: debtIssuanceModuleAddress,
        debtIssuanceModuleV2Address: debtIssuanceModuleV2PolygonAddress,
        slippageIssuanceModuleAddress: slippageIssuanceModuleAddress,
        perpV2BasisTradingModuleAddress:
          perpV2BasisTradingModuleOptimismAddress,
        perpV2BasisTradingModuleViewerAddress:
          perpV2BasisTradingModuleViewerOptimismAddress,
        perpV2LeverageModuleAddress: perpV2BasisTradingModuleOptimismAddress,
        perpV2LeverageModuleViewerAddress:
          perpV2LeverageModuleViewerOptimismAddress,
        delegatedManagerFactoryAddress: delegatedManagerFactoryOptimismAddress,
        issuanceExtensionAddress: issuanceExtensionOptimismAddress,
        streamingFeeExtensionAddress: streamingFeeExtensionOptimismAddress,
        tradeExtensionAddress: tradeExtensionOptimismAddress,
        batchTradeExtensionAddress: basicIssuanceModulePolygonAddress,
      })
      break
    default:
      set = new Set({
        ethersProvider: ethersProvider,
        basicIssuanceModuleAddress: basicIssuanceModuleAddress,
        controllerAddress: controllerAddress,
        masterOracleAddress: masterOracleAddress,
        navIssuanceModuleAddress: navIssuanceModuleAddress,
        protocolViewerAddress: protocolViewerAddress,
        setTokenCreatorAddress: setTokenCreatorAddress,
        streamingFeeModuleAddress: streamingFeeModuleAddress,
        tradeModuleAddress: tradeModuleAddress,
        governanceModuleAddress: governanceModuleAddress,
        debtIssuanceModuleAddress: debtIssuanceModuleAddress,
        debtIssuanceModuleV2Address: debtIssuanceModuleAddress,
        slippageIssuanceModuleAddress: slippageIssuanceModulePolygonAddress,
        perpV2BasisTradingModuleAddress:
          perpV2BasisTradingModuleOptimismAddress,
        perpV2BasisTradingModuleViewerAddress:
          perpV2BasisTradingModuleViewerOptimismAddress,
        perpV2LeverageModuleAddress: perpV2BasisTradingModuleOptimismAddress,
        perpV2LeverageModuleViewerAddress:
          perpV2LeverageModuleViewerOptimismAddress,
        delegatedManagerFactoryAddress: delegatedManagerFactoryOptimismAddress,
        issuanceExtensionAddress: issuanceExtensionOptimismAddress,
        streamingFeeExtensionAddress: streamingFeeExtensionOptimismAddress,
        tradeExtensionAddress: tradeExtensionOptimismAddress,
        batchTradeExtensionAddress: basicIssuanceModuleAddress,
      })
  }
  return set
}
