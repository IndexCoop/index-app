import { createContext, useContext, useEffect, useState } from 'react'

export const ProtectionContext = createContext<boolean>(false)

export const useProtection = () => useContext(ProtectionContext)

export const ProtectionProvider = (props: { children: any }) => {
  const [isProtectable, setIsProtectable] = useState<boolean>(false)

  const checkIfProtectable = async () => {
    fetch('/api/protected')
      .then((res) => res.json())
      .then((response) => {
        console.log('Response from /api/protected: ', response)
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
