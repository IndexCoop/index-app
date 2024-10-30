'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { watchAccount } from '@wagmi/core'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'

import { UserProvider } from '@/app/user-provider'
import { ProtectionProvider } from '@/lib/providers/protection'
import { SignTermsProvider } from '@/lib/providers/sign-terms-provider'
import theme from '@/lib/styles/theme'
import { config, metadata, projectId } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

import type { User } from '@prisma/client'


const queryClient = new QueryClient()

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableOnramp: false,
  enableSwaps: false,
  termsConditionsUrl: 'https://indexcoop.com/terms-of-service',
  privacyPolicyUrl: 'https://indexcoop.com/privacy-policy',
  //  defaultNetwork: networks[0],
  metadata,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [persistedUserData, setPersistedUserData] = useState<User | null>(null)

  useEffect(() => {
    const unwatch = watchAccount(config, {
      async onChange(account) {
        try {
          const user = await (
            await fetch('/api/user', {
              method: 'POST',
              body: JSON.stringify({
                address: account.address,
              }),
            })
          ).json()

          setPersistedUserData(user)
        } catch (e) {
          console.error(e)
        }
      },
    })

    return () => unwatch()
  }, [])

  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <AnalyticsProvider>
              <ProtectionProvider>
                <SignTermsProvider>
                  <UserProvider value={persistedUserData}>
                    {children}
                  </UserProvider>
                </SignTermsProvider>
              </ProtectionProvider>
            </AnalyticsProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
