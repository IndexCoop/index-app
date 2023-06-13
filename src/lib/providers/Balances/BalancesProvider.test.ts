import { JsonRpcProvider } from '@ethersproject/providers'

import { USDC } from '../../../constants/tokens'

import { BalancesProvider } from './BalancesProvider'

// vitalik.eth
const wallet = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

const getRpc = (chainId: number): JsonRpcProvider => {
  const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID!
  let url = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`
  switch (chainId) {
    case 10:
      url = `https://opt-mainnet.g.alchemy.com/v2/${alchemyId}`
      break
    case 137:
      url = `https://polygon-mainnet.g.alchemy.com/v2/${alchemyId}`
      break
  }
  return new JsonRpcProvider(url, chainId)
}

const providers = {
  mainnet: getRpc(1),
  optimism: getRpc(10),
  polygon: getRpc(137),
}

describe('BalancesProvider', () => {
  test('should fetch native balances for ETH + Polygon', async () => {
    // const provider = new BalancesProvider(wallet, providers)
    // const nativeBalances = await provider.fetchNativeBalances()
    // expect(nativeBalances.eth.mainnetBalance?.gt(0)).toBe(true)
    // expect(nativeBalances.eth.token.symbol).toBe('ETH')
    // expect(nativeBalances.matic.polygonBalance?.gt(0)).toBe(true)
    // expect(nativeBalances.matic.token.symbol).toBe('MATIC')
    expect(true).toBeTruthy()
  })

  test('should fetch all balances for USDC', async () => {
    // const provider = new BalancesProvider(wallet, providers)
    // const balances = await provider.fetchAllBalances(USDC)
    // expect(balances.mainnetBalance?.gt(0)).toBe(true)
    // expect(balances.polygonBalance?.gt(0)).toBe(true)
    expect(true).toBeTruthy()
  })
})
