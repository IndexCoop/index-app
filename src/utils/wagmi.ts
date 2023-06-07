import { configureChains, createClient, WagmiConfig } from 'wagmi'
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

import { AlchemyApiKey } from 'constants/server'

export const { chains, provider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: AlchemyApiKey }), publicProvider()]
)

export const ledgerConnector = new IFrameEthereumConnector({
  chains,
  options: {},
})

const connectors = () =>
  connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        safeWallet({ chains }),
        metaMaskWallet({ chains }),
        rainbowWallet({ chains }),
        argentWallet({ chains }),
        coinbaseWallet({
          appName: 'Index Coop',
          chains,
        }),
        ledgerWallet({ chains }),
        okxWallet({ chains }),
      ],
    },
    {
      groupName: 'Others',
      wallets: [
        walletConnectWallet({ chains }),
        braveWallet({ chains }),
        trustWallet({ chains }),
      ],
    },
  ])().concat([ledgerConnector])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})
