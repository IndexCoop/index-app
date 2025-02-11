'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { UserMetadataProvider } from '@/app/user-metadata-provider'
import { useUpsertUser } from '@/lib/hooks/use-upsert-user'
import { ProtectionProvider } from '@/lib/providers/protection'
import { SignTermsProvider } from '@/lib/providers/sign-terms-provider'
import theme from '@/lib/styles/theme'
import { initAppkit, wagmiAdapter } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

initAppkit()

export function Providers({ children }: { children: React.ReactNode }) {
  const persistentUserData = useUpsertUser()

  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <AnalyticsProvider>
              <ProtectionProvider>
                <SignTermsProvider>
                  <UserMetadataProvider value={persistentUserData}>
                    {children}
                  </UserMetadataProvider>
                </SignTermsProvider>
              </ProtectionProvider>
            </AnalyticsProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
