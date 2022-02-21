import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { MAINNET, POLYGON } from 'constants/chains'

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
    [MAINNET.chainId]: MAINNET.rpcUrl,
    [POLYGON.chainId]: POLYGON.rpcUrl,
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: [1, 137],
})

export const networkConnector = new NetworkConnector({
  urls: { 1: process.env.REACT_APP_ALCHEMY_API || MAINNET.rpcUrl },
  defaultChainId: 1,
})
