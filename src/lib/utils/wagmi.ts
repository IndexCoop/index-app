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
import { Chain, http } from 'viem'
import { createConfig } from 'wagmi'
import { localhost, mainnet } from 'wagmi/chains'

import { AlchemyApiKey } from '../../constants/server'

const isDevelopmentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
const isPreviewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
const shouldShowLocalHost = isDevelopmentEnv || isPreviewEnv

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        safeWallet,
        metaMaskWallet,
        rainbowWallet,
        argentWallet,
        coinbaseWallet,
        ledgerWallet,
        okxWallet,
      ],
    },
    {
      groupName: 'Others',
      wallets: [walletConnectWallet, braveWallet, trustWallet],
    },
  ],
  {
    appName: 'Index App',
    projectId,
  },
)

const lh = { ...localhost, id: 31337 }

export const chains: [Chain, ...Chain[]] = [
  mainnet,
  ...(shouldShowLocalHost ? [lh] : []),
]

export const wagmiConfig = createConfig({
  chains,
  connectors,
  ssr: true,
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${AlchemyApiKey}`),
    [lh.id]: http('http://127.0.0.1:8545/'),
  },
})
