import { createContext, useContext } from 'react'

import { GetApiV2UserAddressQueryResponse } from '@/gen'

const UserMetadataContext =
  createContext<GetApiV2UserAddressQueryResponse | null>(null)

export const UserMetadataProvider = UserMetadataContext.Provider

export const useUserMetadata = () => {
  const userMetadata = useContext(UserMetadataContext)

  return userMetadata
}
