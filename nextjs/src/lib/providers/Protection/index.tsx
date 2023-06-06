import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { logEvent } from '../../../lib/utils/api/analytics'

export const ProtectionContext = createContext<{
  isProtectable?: boolean
}>({ isProtectable: true })

export const useProtection = () => useContext(ProtectionContext)

export const ProtectionProvider = (props: { children: any }) => {
  const [isProtectable, setIsProtectable] = useState<boolean>()

  const checkIfProtectable = useCallback(async () => {
    const API_KEY =
      process.env.NEXT_PUBLIC_IP_LOOKUP_KEY ?? 'vN8S4cMfz4KPoq5eLx3X'
    fetch('https://extreme-ip-lookup.com/json/?key=' + API_KEY)
      .then((res) => res.json())
      .then((response) => {
        if (response.country === 'United States') setIsProtectable(true)
      })
      .catch((error) => {
        console.log(
          'Cant determine whether or not we should protect the user because of this error: ',
          error
        )
      })
  }, [])

  useEffect(() => {
    checkIfProtectable()
    logEvent('US_IP_CHECK', { USA_IP: isProtectable })
  }, [])

  return (
    <ProtectionContext.Provider
      value={{
        isProtectable,
      }}
    >
      {props.children}
    </ProtectionContext.Provider>
  )
}
