import { createContext, useContext } from 'react'

import type { User } from '@prisma/client'

const UserContext = createContext<User | null>(null)

export const UserProvider = UserContext.Provider

export const useUser = () => {
  const user = useContext(UserContext)

  return user
}
