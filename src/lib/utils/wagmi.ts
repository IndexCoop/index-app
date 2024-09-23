import { arbitrum, base, mainnet } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { CaipNetwork } from '@reown/appkit-common'
import { cookieStorage, createStorage, http } from '@wagmi/core'

// const isDevelopmentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
// const isPreviewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
const shouldShowLocalHost = false // isDevelopmentEnv

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const localhost: CaipNetwork = {
  chainId: 31337,
  id: `eip155:localhost`,
  name: 'Localhost',
  chainNamespace: 'eip155',
  currency: 'ETH',
  rpcUrl: 'http://localhost:8545',
  explorerUrl: '',
}

export const networks: CaipNetwork[] = [
  {
    ...mainnet,
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  },
  {
    ...arbitrum,
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  },
  {
    ...base,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  },
  ...(shouldShowLocalHost ? [localhost] : []),
]
//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: networks.reduce((acc, network) => ({
    ...acc,
    [network.id]: http(network.rpcUrl),
  })),
  ssr: true,
  projectId,
  networks,
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
