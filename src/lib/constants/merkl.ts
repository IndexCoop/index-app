import type { Address } from 'viem'

export const MERKL_DISTRIBUTOR_ADDRESSES: Record<number, Address> = {
  1: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Ethereum Mainnet
  42161: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Arbitrum
  8453: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Base
  137: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Polygon
} as const

export const getMerklDistributorAddress = (
  chainId: number,
): Address | undefined => {
  return MERKL_DISTRIBUTOR_ADDRESSES[chainId] ?? MERKL_DISTRIBUTOR_ADDRESSES[1]
}
