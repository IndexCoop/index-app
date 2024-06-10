import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAccount, useWalletClient } from 'wagmi'

import { IndexApi } from '@/lib/utils/api/index-api'

interface Context {
  hasSignedTerms: boolean
  hasFetchedSignature: boolean
  signTermsOfService: () => void
}

const SignTermsContext = createContext<Context>({
  hasSignedTerms: false,
  hasFetchedSignature: false,
  signTermsOfService: () => {},
})

interface Props {
  children: ReactNode
}

const SIGN_TERMS_KEY = 'termsOfServiceV1'
const TERMS_MESSAGE = 'I have read and accept the Terms of Service.'

export const SignTermsProvider = ({ children }: Props) => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [hasFetchedSignature, setHasFetchedSignature] = useState(false)
  const [hasSignedTerms, setHasSignedTerms] = useState(false)

  useEffect(() => {
    async function fetchSignature() {
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/signature/${address}`)
        if (res[SIGN_TERMS_KEY]) {
          setHasSignedTerms(true)
        }
      } catch (e) {
        console.error('Signature GET error', e)
      }
      setHasFetchedSignature(true)
    }

    if (!address) return
    setHasFetchedSignature(false)
    setHasSignedTerms(false)

    fetchSignature()
  }, [address])

  const signTermsOfService = async () => {
    let signature: `0x${string}` | undefined
    try {
      signature = await walletClient?.signMessage({
        message: TERMS_MESSAGE,
      })
    } catch (e) {
      console.error('Sign message error', e)
    }

    // Signature required to proceed
    if (signature === undefined) return

    try {
      const indexApi = new IndexApi()
      await indexApi.put(`/signature/${address}`, {
        address,
        signature,
        [SIGN_TERMS_KEY]: new Date().toISOString(),
      })
    } catch (e) {
      console.error('Signature PUT error', e)
    }
    setHasSignedTerms(true)
  }

  return (
    <SignTermsContext.Provider
      value={{
        hasSignedTerms,
        hasFetchedSignature,
        signTermsOfService,
      }}
    >
      {children}
    </SignTermsContext.Provider>
  )
}

export const useSignTerms = () => useContext(SignTermsContext)
