import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  AppKitNetwork,
  arbitrum,
  base,
  localhost,
  mainnet,
  polygon,
} from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { cookieStorage, createStorage, http } from 'wagmi'
import { safe } from 'wagmi/connectors'

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const isDevelopmentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
const isPreviewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
const shouldShowLocalHost = isDevelopmentEnv || isPreviewEnv

// Create a metadata object
export const metadata = {
  name: 'indexcoop-app',
  description: 'IndexCoop App',
  url: 'https://app.indexcoop.com',
  icons: ['/index-logo-black.png'],
}

// default wagmi localhost uses 1_337 as the chain id
const localhostHH = {
  ...localhost,
  id: 31_337,
}

export const chains = [
  arbitrum,
  mainnet,
  base,
  polygon,
  ...(shouldShowLocalHost ? [localhostHH] : []),
] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: chains,
  ssr: true,
  connectors: [safe()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
    [arbitrum.id]: http(
      `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
    [base.id]: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
  },
})

export const initAppkit = () => {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: chains,
    features: {
      email: false,
      onramp: false,
      socials: false,
      swaps: false,
      send: false,
    },
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase
    ],
    termsConditionsUrl: 'https://indexcoop.com/terms-of-service',
    privacyPolicyUrl: 'https://indexcoop.com/privacy-policy',
    metadata,
  })
}
