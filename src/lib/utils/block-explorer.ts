import { ARBITRUM, BASE, MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'

export function getBlockExplorerContractUrl(
  contractAddress: string,
  chainId?: number,
): string {
  switch (chainId) {
    case ARBITRUM.chainId:
      return ARBITRUM.blockExplorerUrl + 'address/' + contractAddress
    case BASE.chainId:
      return BASE.blockExplorerUrl + 'address/' + contractAddress
    case OPTIMISM.chainId:
      return OPTIMISM.blockExplorerUrl + 'address/' + contractAddress
    case POLYGON.chainId:
      return POLYGON.blockExplorerUrl + 'address/' + contractAddress
    default:
      return MAINNET.blockExplorerUrl + 'address/' + contractAddress
  }
}
