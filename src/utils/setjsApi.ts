import { Contract } from 'ethers'
import Set from 'set.js'
import { SetDetails, StreamingFeeInfo } from 'set.js/dist/types/src/types'

import { JsonRpcProvider } from '@ethersproject/providers'

import { OPTIMISM, POLYGON } from 'constants/chains'
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

const ABI = [
  {
    inputs: [
      {
        internalType: 'contract ISetToken[]',
        name: '_setTokens',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_moduleList',
        type: 'address[]',
      },
    ],
    name: 'batchFetchDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'modules',
            type: 'address[]',
          },
          {
            internalType: 'enum ISetToken.ModuleState[]',
            name: 'moduleStatuses',
            type: 'uint8[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'component',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'module',
                type: 'address',
              },
              {
                internalType: 'int256',
                name: 'unit',
                type: 'int256',
              },
              {
                internalType: 'uint8',
                name: 'positionState',
                type: 'uint8',
              },
              {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
              },
            ],
            internalType: 'struct ISetToken.Position[]',
            name: 'positions',
            type: 'tuple[]',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
        ],
        internalType: 'struct SetTokenViewer.SetDetails[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken[]',
        name: '_setTokens',
        type: 'address[]',
      },
    ],
    name: 'batchFetchManagers',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken[]',
        name: '_setTokens',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_modules',
        type: 'address[]',
      },
    ],
    name: 'batchFetchModuleStates',
    outputs: [
      {
        internalType: 'enum ISetToken.ModuleState[][]',
        name: '',
        type: 'uint8[][]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_moduleList',
        type: 'address[]',
      },
    ],
    name: 'getSetDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'modules',
            type: 'address[]',
          },
          {
            internalType: 'enum ISetToken.ModuleState[]',
            name: 'moduleStatuses',
            type: 'uint8[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'component',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'module',
                type: 'address',
              },
              {
                internalType: 'int256',
                name: 'unit',
                type: 'int256',
              },
              {
                internalType: 'uint8',
                name: 'positionState',
                type: 'uint8',
              },
              {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
              },
            ],
            internalType: 'struct ISetToken.Position[]',
            name: 'positions',
            type: 'tuple[]',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
        ],
        internalType: 'struct SetTokenViewer.SetDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

function getModuleAddresses(chainId: number): string[] {
  switch (chainId) {
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
      ]
  }
}

export async function getTokenSupply(
  setTokenAddress: string,
  provider: JsonRpcProvider,
  chainId: number
) {
  const address = protocolViewerAddress
  const contract = new Contract(address, ABI, provider)
  const moduleAddresses = getModuleAddresses(chainId)
  const setDetails: SetDetails = await contract.getSetDetails(
    setTokenAddress,
    moduleAddresses
  )
  console.log(setDetails)
  return setDetails.totalSupply
}

export async function getSetDetails(
  ethersProvider: any,
  productAddresses: string[],
  chainId: number,
  isPerp: boolean = false
): Promise<SetDetails[]> {
  const address = protocolViewerAddress
  const contract = new Contract(address, ABI, ethersProvider)
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

// export async function getTokenSupply(
//   ethersProvider: any,
//   productAddresses: string[],
//   chainId: number
// ): Promise<SetDetails[]> {
//   const set = getSet(ethersProvider, chainId)
//   console.log(set)
//   let moduleAddresses
//   if (chainId === MAINNET.chainId) {
//     moduleAddresses = [
//       basicIssuanceModuleAddress,
//       streamingFeeModuleAddress,
//       tradeModuleAddress,
//       debtIssuanceModuleAddress,
//     ]
//   } else {
//     moduleAddresses = [
//       basicIssuanceModulePolygonAddress,
//       streamingFeeModulePolygonAddress,
//       tradeModulePolygonAddress,
//       debtIssuanceModuleV2PolygonAddress,
//     ]
//   }
//   console.log(moduleAddresses, productAddresses)
//   return await set.setToken.batchFetchSetDetailsAsync(
//     productAddresses,
//     moduleAddresses
//   )
// }

//
// export async function getSetDetails(
//   ethersProvider: any,
//   productAddresses: string[],
//   chainId: number,
//   isPerp: boolean = false
// ): Promise<SetDetails[]> {
//   const set = getSet(ethersProvider, chainId)
//   let moduleAddresses: string[] = []
//   switch (chainId) {
//     case OPTIMISM.chainId:
//       moduleAddresses = [
//         basicIssuanceModuleOptimismAddress,
//         streamingFeeModuleOptimismAddress,
//         tradeModuleOptimismAddress,
//         debtIssuanceModuleV2OptimismAddress,
//         slippageIssuanceModuleOptimismAddress,
//         perpV2BasisTradingModuleOptimismAddress,
//         perpV2LeverageModuleOptimismAddress,
//         perpV2BasisTradingModuleViewerOptimismAddress,
//         perpV2LeverageModuleViewerOptimismAddress,
//       ]
//       break
//     case POLYGON.chainId:
//       moduleAddresses = [
//         basicIssuanceModulePolygonAddress,
//         streamingFeeModulePolygonAddress,
//         tradeModulePolygonAddress,
//         debtIssuanceModuleV2PolygonAddress,
//       ]
//       break
//     default:
//       moduleAddresses = [
//         basicIssuanceModuleAddress,
//         streamingFeeModuleAddress,
//         tradeModuleAddress,
//         debtIssuanceModuleAddress,
//         debtIssuanceModuleV2Address,
//       ]
//   }
//
//   /**
//    * TODO: This isn't needed for the short term, but long term we need to account for all positions in NAV calcs + when showing positions on the allocations page.
//    * This is how you get Perpetual Protocol products to show their full positions. For now will just log them, but they need to be added to the allocations list.
//    */
//   if (isPerp) {
//     try {
//       const address = MNYeIndex.optimismAddress || ''
//       const arr =
//         await set.perpV2BasisTradingViewer.getVirtualAssetsDisplayInfoAsync(
//           address,
//           ethersProvider.address
//         )
//
//       const arr2 =
//         await set.perpV2LeverageViewer.getVirtualAssetsDisplayInfoAsync(
//           address,
//           ethersProvider.address
//         )
//     } catch (e) {
//       console.log('PERP error', e)
//     }
//   }
//   return set.setToken.batchFetchSetDetailsAsync(
//     productAddresses,
//     moduleAddresses
//   )
// }

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
