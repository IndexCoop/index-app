import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { CaipNetwork } from '@reown/appkit-common'
import { arbitrum, base, mainnet } from '@reown/appkit/networks'
import { cookieStorage, createStorage, http } from '@wagmi/core'

const isDevelopmentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
const isPreviewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
const shouldShowLocalHost = isDevelopmentEnv || isPreviewEnv

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

// import { connectorsForWallets } from '@rainbow-me/rainbowkit'
// import {
//   argentWallet,
//   braveWallet,
//   coinbaseWallet,
//   ledgerWallet,
//   metaMaskWallet,
//   okxWallet,
//   rainbowWallet,
//   safeWallet,
//   trustWallet,
//   walletConnectWallet,
// } from '@rainbow-me/rainbowkit/wallets'
// import { Chain, http } from 'viem'
// import { createConfig } from 'wagmi'
// import { arbitrum, base, localhost, mainnet } from 'wagmi/chains'

// import { AlchemyApiKey } from '../../constants/server'

// const isDevelopmentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
// const isPreviewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
// const shouldShowLocalHost = isDevelopmentEnv || isPreviewEnv

// const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [
//         safeWallet,
//         metaMaskWallet,
//         rainbowWallet,
//         argentWallet,
//         coinbaseWallet,
//         ledgerWallet,
//         okxWallet,
//       ],
//     },
//     {
//       groupName: 'Others',
//       wallets: [walletConnectWallet, braveWallet, trustWallet],
//     },
//   ],
//   {
//     appName: 'Index App',
//     projectId,
//   },
// )

// const lh = { ...localhost, id: 31337 }

// export const chains: [Chain, ...Chain[]] = [
//   mainnet,
//   arbitrum,
//   base,
//   ...(shouldShowLocalHost ? [lh] : []),
// ]

// export const wagmiConfig = createConfig({
//   chains,
//   connectors,
//   ssr: true,
//   transports: {
//     [arbitrum.id]: http(
//       `https://arb-mainnet.g.alchemy.com/v2/${AlchemyApiKey}`,
//     ),
//     [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${AlchemyApiKey}`),
//     [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${AlchemyApiKey}`),
//     [lh.id]: http('http://127.0.0.1:8545/'),
//   },
// })
