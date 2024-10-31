import { createContext, useContext } from 'react'

import type { User } from '@prisma/client'

const UserMetadataContext = createContext<User | null>(null)

export const UserMetadataProvider = UserMetadataContext.Provider

export const useUserMetadata = () => {
  const userMetadata = useContext(UserMetadataContext)

  return userMetadata
}
