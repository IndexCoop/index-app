import { arbitrum, base } from 'viem/chains'

export type ChainData = {
  name: string
  chainId: number
  chainId0x: string
  rpcUrl: string
  icon: string
  coingeckoId: string
  blockExplorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export const ARBITRUM: ChainData = {
  name: 'Arbitrum',
  chainId: arbitrum.id,
  chainId0x: '0xA4B1',
  rpcUrl: arbitrum.rpcUrls.default.http[0],
  icon: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
  coingeckoId: 'arbitrum',
  blockExplorerUrl: arbitrum.blockExplorers.default.url + '/',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}

export const BASE: ChainData = {
  name: 'Base',
  chainId: base.id,
  chainId0x: '0x2105',
  rpcUrl: base.rpcUrls.default.http[0],
  icon: 'https://assets.coingecko.com/nft_contracts/images/2989/large/base-introduced.png',
  coingeckoId: 'base',
  blockExplorerUrl: base.blockExplorers.default.url + '/',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}

export const MAINNET: ChainData = {
  name: 'Ethereum',
  chainId: 1,
  chainId0x: '0x1',
  rpcUrl: 'https://mainnet.eth.aragon.network/',
  icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg',
  coingeckoId: 'ethereum',
  blockExplorerUrl: 'https://etherscan.io/',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}

export const POLYGON: ChainData = {
  name: 'Polygon',
  chainId: 137,
  chainId0x: '0x89',
  rpcUrl: 'https://rpc-mainnet.maticvigil.com/',
  icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg',
  coingeckoId: 'polygon-pos',
  blockExplorerUrl: 'https://polygonscan.com/',
  nativeCurrency: {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
  },
}

export const OPTIMISM: ChainData = {
  name: 'Optimism',
  chainId: 10,
  chainId0x: '0xA',
  rpcUrl: 'https://mainnet.optimism.io/',
  icon: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/Profile-Logo.png',
  coingeckoId: 'optimistic-ethereum',
  blockExplorerUrl: 'https://optimistic.etherscan.io/',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}
