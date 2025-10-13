'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useAccount } from 'wagmi'

interface Context {
  isNewUser: boolean
  isForbiddenAddress: boolean
  isRestrictedCountry: boolean
  isUsingVpn: boolean
}

const ProtectionContext = createContext<Context>({
  isNewUser: false,
  isForbiddenAddress: false,
  isRestrictedCountry: false,
  isUsingVpn: false,
})

export const useProtectionContext = () => useContext(ProtectionContext)

export const ProtectionProvider = (props: { children: any }) => {
  const { address } = useAccount()
  const {
    data: { isForbiddenAddress, isRestrictedCountry, isNewUser, isUsingVpn },
  } = useQuery({
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: {
      isNewUser: false,
      isForbiddenAddress: false,
      isRestrictedCountry: false,
      isUsingVpn: false,
    },
    queryKey: ['protections', address],
    queryFn: async () => {
      const url = address
        ? `/api/protections?${new URLSearchParams({ address }).toString()}`
        : '/api/protections'
      const res = await fetch(url)
      const { isForbiddenAddress, isRestrictedCountry, isNewUser, isUsingVpn } =
        await res.json()

      return {
        isForbiddenAddress,
        isRestrictedCountry,
        isNewUser,
        isUsingVpn,
      }
    },
  })

  return (
    <ProtectionContext.Provider
      value={{ isForbiddenAddress, isRestrictedCountry, isNewUser, isUsingVpn }}
    >
      {props.children}
    </ProtectionContext.Provider>
  )
}
