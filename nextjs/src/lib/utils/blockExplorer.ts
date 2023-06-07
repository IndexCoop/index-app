import { MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'

export function getBlockExplorerContractUrl(
  contractAddress: string,
  chainId?: number
): string {
  switch (chainId) {
    case OPTIMISM.chainId:
      return OPTIMISM.blockExplorerUrl + 'address/' + contractAddress
    case POLYGON.chainId:
      return POLYGON.blockExplorerUrl + 'address/' + contractAddress
    default:
      return MAINNET.blockExplorerUrl + 'address/' + contractAddress
  }
}

export function getBlockExplorerUrl(txHash: string, chainId?: number): string {
  switch (chainId) {
    case OPTIMISM.chainId:
      return OPTIMISM.blockExplorerUrl + 'tx/' + txHash
    case POLYGON.chainId:
      return POLYGON.blockExplorerUrl + 'tx/' + txHash
    default:
      return MAINNET.blockExplorerUrl + 'tx/' + txHash
  }
}
