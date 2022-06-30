import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const ProtectionContext = createContext<{
  isProtectable?: boolean
}>({ isProtectable: true })

export const useProtection = () => useContext(ProtectionContext)

export const ProtectionProvider = (props: { children: any }) => {
  const [isProtectable, setIsProtectable] = useState<boolean>()

  const checkIfProtectable = useCallback(async () => {
    fetch('http://ip-api.com/json/?fields=countryCode')
      .then((res) => res.json())
      .then((response) => {
        if (response.countryCode === 'US') setIsProtectable(true)
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
