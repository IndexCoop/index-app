import { useEthers } from '@usedapp/core'

import { ChainData, MAINNET, OPTIMISM, POLYGON } from 'constants/chains'

export const useNetwork = () => {
  const { library, account, chainId } = useEthers()

  /**
   * Changes to Mainnet
   */
  const setMainnet = () => {
    if (library)
      library.send('wallet_switchEthereumChain', [
        { chainId: MAINNET.chainId0x },
        account,
      ])
  }

  /**
   * Changes to CHAIN
   */
  const setOtherNetwork = (CHAIN: ChainData) => {
    if (library)
      library?.send('wallet_addEthereumChain', [
        {
          chainId: CHAIN.chainId0x,
          chainName: CHAIN.name,
          nativeCurrency: {
            name: CHAIN.nativeCurrency.name,
            symbol: CHAIN.nativeCurrency.symbol,
            decimals: CHAIN.nativeCurrency.decimals,
          },
          rpcUrls: [CHAIN.rpcUrl],
          blockExplorerUrls: [CHAIN.blockExplorerUrl],
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
        setOtherNetwork(POLYGON)
        break
      case OPTIMISM.chainId:
        setOtherNetwork(OPTIMISM)
        break
      default:
        break
    }
  }

  return {
    chainId,
    changeNetwork,
    setMainnet,
    setOtherNetwork,
  }
}
