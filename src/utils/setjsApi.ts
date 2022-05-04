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
  governanceModuleAddress,
  masterOracleAddress,
  navIssuanceModuleAddress,
  protocolViewerAddress,
  protocolViewerOptimismAddress,
  protocolViewerPolygonAddress,
  setTokenCreatorAddress,
  slippageIssuanceModuleAddress,
  slippageIssuanceModulePolygonAddress,
  streamingFeeModuleAddress,
  streamingFeeModuleOptimismAddress,
  streamingFeeModulePolygonAddress,
  tradeModuleAddress,
  tradeModuleOptimismAddress,
  tradeModulePolygonAddress,
} from 'constants/ethContractAddresses'

export async function getTokenSupply(
  ethersProvider: any,
  productAddresses: string[],
  chainId: number
): Promise<SetDetails[]> {
  if (
    basicIssuanceModuleAddress === undefined ||
    basicIssuanceModulePolygonAddress === undefined ||
    streamingFeeModuleAddress === undefined ||
    streamingFeeModulePolygonAddress === undefined ||
    tradeModuleAddress === undefined ||
    tradeModulePolygonAddress === undefined ||
    debtIssuanceModuleAddress === undefined ||
    debtIssuanceModuleV2Address === undefined ||
    debtIssuanceModuleV2PolygonAddress === undefined
  ) {
    throw new Error(
      'A set JS module address is not defined. Please check your .env file'
    )
  }

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
  chainId: number
): Promise<SetDetails[]> {
  if (
    basicIssuanceModuleAddress === undefined ||
    basicIssuanceModulePolygonAddress === undefined ||
    streamingFeeModuleAddress === undefined ||
    streamingFeeModulePolygonAddress === undefined ||
    tradeModuleAddress === undefined ||
    tradeModulePolygonAddress === undefined ||
    debtIssuanceModuleAddress === undefined ||
    debtIssuanceModuleV2Address === undefined ||
    debtIssuanceModuleV2PolygonAddress === undefined ||
    basicIssuanceModuleOptimismAddress === undefined ||
    debtIssuanceModuleV2OptimismAddress === undefined ||
    streamingFeeModuleOptimismAddress === undefined ||
    tradeModuleOptimismAddress === undefined
  ) {
    throw new Error(
      'A set JS module address is not defined. Please check your .env file'
    )
  }

  const set = getSet(ethersProvider, chainId)
  let moduleAddresses: string[] = []
  switch (chainId) {
    case OPTIMISM.chainId:
      moduleAddresses = [
        basicIssuanceModuleOptimismAddress,
        streamingFeeModuleOptimismAddress,
        tradeModuleOptimismAddress,
        debtIssuanceModuleV2OptimismAddress,
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
  return set.setToken.batchFetchSetDetailsAsync(
    productAddresses,
    moduleAddresses
  )
}

function getSet(ethersProvider: any, chainId: number): Set {
  if (
    !chainId ||
    basicIssuanceModuleAddress === undefined ||
    basicIssuanceModulePolygonAddress === undefined ||
    controllerAddress === undefined ||
    masterOracleAddress === undefined ||
    navIssuanceModuleAddress === undefined ||
    protocolViewerAddress === undefined ||
    protocolViewerPolygonAddress === undefined ||
    setTokenCreatorAddress === undefined ||
    streamingFeeModuleAddress === undefined ||
    streamingFeeModulePolygonAddress === undefined ||
    tradeModuleAddress === undefined ||
    tradeModulePolygonAddress === undefined ||
    governanceModuleAddress === undefined ||
    debtIssuanceModuleAddress === undefined ||
    debtIssuanceModuleV2Address === undefined ||
    debtIssuanceModuleV2PolygonAddress === undefined ||
    slippageIssuanceModuleAddress === undefined ||
    slippageIssuanceModulePolygonAddress === undefined ||
    basicIssuanceModuleOptimismAddress === undefined ||
    debtIssuanceModuleV2OptimismAddress === undefined ||
    streamingFeeModuleOptimismAddress === undefined ||
    tradeModuleOptimismAddress === undefined ||
    protocolViewerOptimismAddress === undefined
  ) {
    throw new Error(
      'A set JS address is not defined. Please check your .env file'
    )
  }
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
        slippageIssuanceModuleAddress: slippageIssuanceModuleAddress,
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
      })
  }
  return set
}
