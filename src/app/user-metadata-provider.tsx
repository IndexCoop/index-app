import { createContext, useContext } from 'react'

import { useRefId } from '@/lib/hooks/use-ref-id'

import type { GetApiV2UserAddressQueryResponse } from '@/gen'

const UserMetadataContext =
  createContext<GetApiV2UserAddressQueryResponse | null>(null)

export const UserMetadataProvider = UserMetadataContext.Provider

export const useUserMetadata = () => {
  useRefId()
  const userMetadata = useContext(UserMetadataContext)

  return userMetadata
}
