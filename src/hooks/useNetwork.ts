import { useEthers } from '@usedapp/core'

import { MAINNET, POLYGON } from 'constants/chains'

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
          chainName: POLYGON.name,
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: [POLYGON.rpcUrl],
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
        account,
      ])
  }

  const changeNetwork = (chainId: string) => {
    const chainNumber = parseInt(chainId)
    switch (chainNumber) {
      case MAINNET.chainId:
        setMainnet()
        break
      case POLYGON.chainId:
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
