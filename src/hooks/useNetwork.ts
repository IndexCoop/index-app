import { useEthers } from '@usedapp/core'

export type ChainData = {
  name: string
  chainId: number
  rpcUrl: string
  icon: string
  coingeckoId: string
}

export const MAINNET_CHAIN_DATA: ChainData = {
  name: 'Ethereum',
  chainId: 1,
  rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg',
  coingeckoId: 'ethereum',
}
export const POLYGON_CHAIN_DATA: ChainData = {
  name: 'Polygon',
  chainId: 137,
  rpcUrl: 'https://rpc-mainnet.maticvigil.com/',
  icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg',
  coingeckoId: 'polygon-pos',
}

export const SUPPORTED_CHAINS = [MAINNET_CHAIN_DATA, POLYGON_CHAIN_DATA]

export const useNetwork = () => {
  const { library, account } = useEthers()

  /**
   * Changes to Mainnet
   */
  const setMainnet = () => {
    if (library)
      library.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
  }

  /**
   * Changes to Polygon
   */
  const setPolygon = () => {
    if (library)
      library?.send('wallet_addEthereumChain', [
        {
          chainId: '0x89',
          chainName: POLYGON_CHAIN_DATA.name,
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: [POLYGON_CHAIN_DATA.rpcUrl],
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
        account,
      ])
  }

  const changeNetwork = (chainId: string) => {
    const chainNumber = parseInt(chainId)
    switch (chainNumber) {
      case MAINNET_CHAIN_DATA.chainId:
        setMainnet()
        break
      case POLYGON_CHAIN_DATA.chainId:
        setPolygon()
        break
      default:
        break
    }
  }

  return {
    changeNetwork,
    setMainnet,
    setPolygon,
  }
}
