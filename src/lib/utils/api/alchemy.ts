import { getFlashMintLeveragedContract } from '@indexcoop/flash-mint-sdk'
import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk'
import { Address, zeroAddress } from 'viem'
import * as chains from 'viem/chains'

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID

const AlchemyApi = {
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
  user?: Address,
  contractAddresses?: Address[],
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

  const flashMintContract = getFlashMintLeveragedContract(
    undefined,
    chainId,
  ).address

  const transfers = (
    await Promise.all([
      client.core.getAssetTransfers({
        // Closed positions
        contractAddresses,
        fromAddress: user,
        toAddress: flashMintContract,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
      }),
      client.core.getAssetTransfers({
        // Opened positions
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
