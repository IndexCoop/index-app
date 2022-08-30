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
} from 'constants/contractAddresses'

import { getModuleAddresses, getProtocolViewerAddress } from './setjsApi'

describe('getModuleAddresses', () => {
  test('returns correct addresses for mainnet', () => {
    const expextedAddresses = [
      basicIssuanceModuleAddress,
      streamingFeeModuleAddress,
      tradeModuleAddress,
      debtIssuanceModuleAddress,
      debtIssuanceModuleV2Address,
    ]
    const addresses = getModuleAddresses(1)
    expect(addresses).toEqual(expextedAddresses)
  })

  test('returns correct addresses for optimism', () => {
    const expextedAddresses = [
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
    const addresses = getModuleAddresses(10)
    expect(addresses).toEqual(expextedAddresses)
  })

  test('returns correct addresses for polygon', () => {
    const expextedAddresses = [
      basicIssuanceModulePolygonAddress,
      streamingFeeModulePolygonAddress,
      tradeModulePolygonAddress,
      debtIssuanceModuleV2PolygonAddress,
    ]
    const addresses = getModuleAddresses(137)
    expect(addresses).toEqual(expextedAddresses)
  })
})

describe('getProtocolViewerAddress', () => {
  test('returns correct address for mainnet', () => {
    const expextedAddresses = protocolViewerAddress
    const address = getProtocolViewerAddress(1)
    expect(address).toEqual(expextedAddresses)
  })

  test('returns correct address for optimism', () => {
    const expextedAddresses = protocolViewerOptimismAddress
    const address = getProtocolViewerAddress(10)
    expect(address).toEqual(expextedAddresses)
  })

  test('returns correct address for polygon', () => {
    const expextedAddresses = protocolViewerPolygonAddress
    const address = getProtocolViewerAddress(137)
    expect(address).toEqual(expextedAddresses)
  })
})
