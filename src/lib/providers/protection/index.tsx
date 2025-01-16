'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useAccount } from 'wagmi'

interface Context {
  isRestrictedCountry: boolean
  isUsingVpn: boolean
}

export const ProtectionContext = createContext<Context>({
  isRestrictedCountry: false,
  isUsingVpn: false,
})

export const useProtectionContext = () => useContext(ProtectionContext)

export const ProtectionProvider = (props: { children: any }) => {
  const { address } = useAccount()
  const {
    data: { isRestrictedCountry, isUsingVpn },
  } = useQuery({
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: { isRestrictedCountry: false, isUsingVpn: false },
    queryKey: ['protections', address],
    queryFn: async () => {
      const url = address
        ? `/api/protections?${new URLSearchParams({ address }).toString()}`
        : '/api/protections'
      const res = await fetch(url)
      const { isRestrictedCountry, isUsingVpn } = await res.json()

      return {
        isRestrictedCountry,
        isUsingVpn,
      }
    },
  })

  return (
    <ProtectionContext.Provider value={{ isRestrictedCountry, isUsingVpn }}>
      {props.children}
    </ProtectionContext.Provider>
  )
}
