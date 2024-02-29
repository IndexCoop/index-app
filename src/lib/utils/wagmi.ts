import { configureChains, createConfig } from 'wagmi'
import { localhost, mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

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

const isDevelopmentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
const isPreviewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
const shouldShowLocalHost = isDevelopmentEnv || isPreviewEnv

const networks = [mainnet, ...(shouldShowLocalHost ? [localhost] : [])]

export const { chains, publicClient } = configureChains(networks, [
  alchemyProvider({ apiKey: AlchemyApiKey }),
  publicProvider(),
])

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
        walletConnectWallet({
          chains,
          options: {
            metadata: {
              name: 'Index App',
              description: 'Buy & Sell Our Tokens',
              url: 'https://app.indexcoop.com/',
              icons: [
                '<https://app.indexcoop.com/assets/index-logo-black.svg>',
              ],
            },
            projectId,
          },
          projectId,
        }),
        braveWallet({ chains }),
        trustWallet({ chains, projectId }),
      ],
    },
  ])()

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})
