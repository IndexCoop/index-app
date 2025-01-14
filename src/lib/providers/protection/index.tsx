'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

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
  const {
    data: { isRestrictedCountry, isUsingVpn },
  } = useQuery({
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: { isRestrictedCountry: false, isUsingVpn: false },
    queryKey: ['protections'],
    queryFn: async () => {
      // FIXME: Update hostname
      const res = await fetch(
        'https://api-pr-29-80wy.onrender.com/api/v2/protections',
      )
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
