import { ethers, providers } from 'ethers'

// Hardhat
export const LocalhostProvider = new providers.JsonRpcProvider(
  'http://127.0.0.1:8545/'
)

// Hardhat Account #0
export const SignerAccount0 = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  LocalhostProvider
)
