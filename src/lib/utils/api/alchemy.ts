import { getIndexFlashMintLeveragedExtendedContract } from '@indexcoop/flash-mint-sdk'
import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk'
import { zeroAddress } from 'viem'
import * as chains from 'viem/chains'

// const indexTokenTransfersReducer =
//   (chainId: number) =>
//   (
//     acc: Record<string, { contractAddresses: string[] }>,
//     tokenAddress: string,
//   ): Record<string, { contractAddresses: string[] }> => {
//     const flashMintContract = getIndexFlashMintLeveragedExtendedContract(
//       undefined,
//       chainId,
//     ).address

//     return {
//       ...acc,
//       [flashMintContract]: {
//         contractAddresses: (
//           acc[flashMintContract]?.contractAddresses ?? []
//         ).concat(tokenAddress),
//       },
//     }
//   }

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID

const AlchemyApi = {
  [chains.mainnet.id]: new Alchemy({
    apiKey,
    network: Network.ETH_MAINNET,
  }),
  [chains.arbitrum.id]: new Alchemy({
    apiKey,
    network: Network.ARB_MAINNET,
  }),
  [chains.base.id]: new Alchemy({
    apiKey,
    network: Network.BASE_MAINNET,
  }),
}

type SupportedChainId = keyof typeof AlchemyApi

export const fetchTokenTransfers = async (
  user?: string,
  contractAddresses?: string[],
  chainId?: number,
) => {
  if (
    !user ||
    !contractAddresses?.length ||
    !chainId ||
    chainId in AlchemyApi === false
  )
    return []

  const client = AlchemyApi[chainId as SupportedChainId]

  const flashMintContract = getIndexFlashMintLeveragedExtendedContract(
    undefined,
    chainId,
  ).address

  const transfers = (
    await Promise.all([
      client.core.getAssetTransfers({
        contractAddresses,
        fromAddress: user,
        toAddress: flashMintContract,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
      }),
      // Incoming transfers: from zero address to user
      client.core.getAssetTransfers({
        contractAddresses,
        fromAddress: zeroAddress,
        toAddress: user,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
      }),
    ])
  ).flatMap(({ transfers }) => transfers)

  return transfers
}
