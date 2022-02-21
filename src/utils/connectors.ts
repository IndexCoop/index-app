import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { MAINNET_CHAIN_DATA, POLYGON_CHAIN_DATA } from 'hooks/useNetwork'

const WS_URL = process.env.REACT_APP_ETHEREUM_WS_URL

if (!WS_URL) {
  throw new Error(
    `REACT_APP_ETHEREUM_WS_URL must be a defined environment variable`
  )
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137],
})

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [MAINNET_CHAIN_DATA.chainId]: MAINNET_CHAIN_DATA.rpcUrl,
    [POLYGON_CHAIN_DATA.chainId]: POLYGON_CHAIN_DATA.rpcUrl,
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: [1, 137],
})

export const networkConnector = new NetworkConnector({
  urls: { 1: process.env.REACT_APP_ALCHEMY_API || MAINNET_CHAIN_DATA.rpcUrl },
  defaultChainId: 1,
})
