import { configureChains, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { IFrameEthereumConnector } from '@ledgerhq/ledger-live-wagmi-connector'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

import { AlchemyApiKey } from '../../constants/server'

export const { chains, publicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: AlchemyApiKey }), publicProvider()]
)

export const ledgerConnector = new IFrameEthereumConnector({
  chains,
  options: {},
})

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!

const connectors = () =>
  connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        safeWallet({ chains }),
        metaMaskWallet({ chains, projectId }),
        rainbowWallet({ chains, projectId }),
        argentWallet({ chains, projectId }),
        coinbaseWallet({
          appName: 'Index Coop',
          chains,
        }),
        ledgerWallet({ chains, projectId }),
        okxWallet({ chains, projectId }),
      ],
    },
    {
      groupName: 'Others',
      wallets: [
        walletConnectWallet({ chains, projectId }),
        braveWallet({ chains }),
        trustWallet({ chains, projectId }),
      ],
    },
  ])() // .concat([ledgerConnector])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})
