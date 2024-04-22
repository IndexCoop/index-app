import { useDisclosure } from '@chakra-ui/react'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAccount } from 'wagmi'

import { IndexApi } from '@/lib/utils/api/index-api'

interface Context {
  hasSignedTerms: boolean
  isSignTermsModalOpen: boolean
  onOpenSignTermsModal: () => void
  onCloseSignTermsModal: () => void
  setHasSignedTerms: Dispatch<SetStateAction<boolean>>
  signTermsOfService: () => void
}

const SignTermsContext = createContext<Context>({
  hasSignedTerms: false,
  isSignTermsModalOpen: false,
  onOpenSignTermsModal: () => {},
  onCloseSignTermsModal: () => {},
  setHasSignedTerms: () => {},
  signTermsOfService: () => {},
})

interface Props {
  children: ReactNode
}

const SIGN_TERMS_KEY = 'termsOfService'

export const SignTermsProvider = ({ children }: Props) => {
  const { address } = useAccount()
  const [hasSignedTerms, setHasSignedTerms] = useState(false)
  const {
    isOpen: isSignTermsModalOpen,
    onOpen: onOpenSignTermsModal,
    onClose: onCloseSignTermsModal,
  } = useDisclosure()

  useEffect(() => {
    async function fetchSignature() {
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/signature/${address}`)
        const json = await res.json()
        if (json[SIGN_TERMS_KEY]) {
          setHasSignedTerms(true)
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (!address) return
    fetchSignature()
  }, [address])

  const signTermsOfService = async () => {
    try {
      const indexApi = new IndexApi()
      await indexApi.put(`/signature/${address}`, {
        [SIGN_TERMS_KEY]: new Date().toISOString(),
      })
    } catch (e) {
      console.error(e)
    }
    setHasSignedTerms(true)
    onCloseSignTermsModal()
  }

  return (
    <SignTermsContext.Provider
      value={{
        hasSignedTerms,
        isSignTermsModalOpen,
        onOpenSignTermsModal,
        onCloseSignTermsModal,
        setHasSignedTerms,
        signTermsOfService,
      }}
    >
      {children}
    </SignTermsContext.Provider>
  )
  return
}

export const useSignTerms = () => useContext(SignTermsContext)
