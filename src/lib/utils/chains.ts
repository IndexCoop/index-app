interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

const MevBlockerParams: AddEthereumChainParameter = {
  chainId: '0x1',
  chainName: 'MEV Blocker (Ethereum Mainnet)',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.mevblocker.io'],
  blockExplorerUrls: ['https://etherscan.io'],
}

export async function addMEVProtectionChain(ethereum: any): Promise<void> {
  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [MevBlockerParams],
    })
  } catch (addError: any) {
    console.warn('Error adding MEV Blocker', addError)
  }
}
