import {
  AppKitNetwork,
  arbitrum,
  base,
  localhost,
  mainnet,
  polygon,
} from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
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
const metadata = {
  name: 'indexcoop-app',
  description: 'IndexCoop App',
  url: 'https://app.indexcoop.com',
  icons: ['/index-logo-black.png'],
}

export const supportedNetworks = {
  [mainnet.id]: {
    ...mainnet,
    rpcUrls: {
      default: {
        http: [
          `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        ],
      },
    },
  },
  [arbitrum.id]: {
    ...arbitrum,
    rpcUrls: {
      default: {
        http: [
          `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        ],
      },
    },
  },
  [base.id]: {
    ...base,
    rpcUrls: {
      default: {
        http: [
          `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        ],
      },
    },
  },
  [polygon.id]: {
    ...polygon,
    rpcUrls: {
      default: {
        http: [
          `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        ],
      },
    },
  },
  ...(shouldShowLocalHost
    ? {
        [31_337]: {
          ...localhost,
          id: 31_337,
        },
      }
    : {}),
}

export type SupportedNetwork = keyof typeof supportedNetworks

export const isSupportedNetwork = (
  chainId: unknown,
): chainId is SupportedNetwork => {
  if (typeof chainId !== 'number' && typeof chainId !== 'string') return false

  return Object.hasOwnProperty.call(supportedNetworks, chainId)
}

export const chains = Object.values(supportedNetworks) as AppKitNetwork[]

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
    networks: chains as [AppKitNetwork, ...AppKitNetwork[]],
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
