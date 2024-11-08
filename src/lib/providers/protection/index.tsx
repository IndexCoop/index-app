import { createContext, useContext, useEffect, useState } from 'react'

export const ProtectionContext = createContext<boolean>(false)

export const useProtection = () => useContext(ProtectionContext)

export const ProtectionProvider = (props: { children: any }) => {
  const [isProtectable, setIsProtectable] = useState<boolean>(false)

  const checkIfProtectable = async () => {
    const API_KEY =
      process.env.NEXT_PUBLIC_IP_LOOKUP_KEY ?? 'vN8S4cMfz4KPoq5eLx3X'
    fetch('https://extreme-ip-lookup.com/json/?key=' + API_KEY)
      .then((res) => res.json())
      .then((response) => {
        if (response.country === 'United States') setIsProtectable(true)
      })
      .catch((error) => {
        console.error(
          'Cant determine whether or not we should protect the user because of this error: ',
          error,
        )
      })
  }

  useEffect(() => {
    checkIfProtectable()
  }, [])

  return (
    <ProtectionContext.Provider value={isProtectable}>
      {props.children}
    </ProtectionContext.Provider>
  )
}
