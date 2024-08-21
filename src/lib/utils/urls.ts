import { arbitrum, base, baseSepolia, mainnet, sepolia } from 'viem/chains'

export function getAlchemyBaseUrl(chainId: number): string {
  switch (chainId) {
    case arbitrum.id:
      return 'https://arb-mainnet.g.alchemy.com/v2/'
    case base.id:
      return 'https://base-mainnet.g.alchemy.com/v2/'
    case baseSepolia.id:
      return 'https://base-sepolia.g.alchemy.com/v2/'
    case mainnet.id:
      return 'https://eth-mainnet.g.alchemy.com/v2/'
    case sepolia.id:
      return 'https://eth-sepolia.g.alchemy.com/v2/'
    default:
      throw new Error('Alchemy Base URL not defined!')
  }
}
