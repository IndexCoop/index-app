import {
  Alchemy,
  AlchemySettings,
  AssetTransfersCategory,
  Network,
} from 'alchemy-sdk'
import * as chains from 'viem/chains'

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID

const createAlchemyClient = <N extends number>(
  chainId: N,
  alchemyNetwork: Network,
): Record<N, (settings?: AlchemySettings) => Alchemy> => ({
  [chainId]: (settings?: AlchemySettings) => {
    return new Alchemy({
      ...settings,
      apiKey,
      network: alchemyNetwork,
    })
  },
})

export const AlchemyApi = {
  ...createAlchemyClient(chains.mainnet.id, Network.ETH_MAINNET),
  ...createAlchemyClient(chains.arbitrum.id, Network.ARB_MAINNET),
  ...createAlchemyClient(chains.base.id, Network.BASE_MAINNET),
}

type SupportedChainId = keyof typeof AlchemyApi

export const fetchTokenTransfers = async (
  user?: string,
  contractAddresses?: string[],
  chainId?: number,
  extendAlchemySettings: AlchemySettings = {},
) => {
  if (
    !user ||
    !contractAddresses?.length ||
    !chainId ||
    chainId in AlchemyApi === false
  )
    return []

  const client = AlchemyApi[chainId as SupportedChainId](extendAlchemySettings)

  const transfers = (
    await Promise.all([
      client.core.getAssetTransfers({
        contractAddresses,
        fromAddress: user,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
      }),
      client.core.getAssetTransfers({
        contractAddresses,
        toAddress: user,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
      }),
    ])
  ).flatMap(({ transfers }) => transfers)

  return transfers
}
