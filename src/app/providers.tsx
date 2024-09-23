'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'

import { ProtectionProvider } from '@/lib/providers/protection'
import { SignTermsProvider } from '@/lib/providers/sign-terms-provider'
import theme from '@/lib/styles/theme'
import { networks, projectId, wagmiAdapter } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

const metadata = {
  name: 'indexcoop-app',
  description: 'IndexCoop App',
  url: 'https://app.indexcoop.com',
  icons: [],
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  termsConditionsUrl: 'https://indexcoop.com/terms-of-service',
  privacyPolicyUrl: 'https://indexcoop.com/privacy-policy',
  //  defaultNetwork: networks[0],
  metadata,
  features: {
    email: false,
    onramp: false,
    swaps: false,
    socials: false,
  },
})

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  )

  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiProvider
          config={wagmiAdapter.wagmiConfig}
          initialState={initialState}
        >
          <QueryClientProvider client={queryClient}>
            <AnalyticsProvider>
              <ProtectionProvider>
                <SignTermsProvider>{children}</SignTermsProvider>
              </ProtectionProvider>
            </AnalyticsProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
