import { User } from '@prisma/client'
import { watchAccount } from '@wagmi/core'
import { useEffect, useState } from 'react'

import { config } from '@/lib/utils/wagmi'

export const useUpsertUser = () => {
  const [persistentUserData, setPersistentUserData] = useState<User | null>(
    null,
  )

  useEffect(() => {
    const unwatch = watchAccount(config, {
      async onChange(account, prevAccount) {
        try {
          if (account.address && prevAccount.address !== account.address) {
            const user = await (
              await fetch(`/api/user/${account.address}`, {
                method: 'GET',
              })
            ).json()

            setPersistentUserData(user)
          }
        } catch (e) {
          console.error(e)
        }
      },
    })

    return () => unwatch()
  }, [])

  return persistentUserData
}
