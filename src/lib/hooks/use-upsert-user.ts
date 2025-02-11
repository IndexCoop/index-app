import { watchAccount } from '@wagmi/core'
import { useEffect, useState } from 'react'

import { wagmiAdapter } from '@/lib/utils/wagmi'

import type { GetApiV2UserAddress200 } from '@/gen'

export const useUpsertUser = () => {
  const [persistentUserData, setPersistentUserData] =
    useState<GetApiV2UserAddress200 | null>(null)

  useEffect(() => {
    const unwatch = watchAccount(wagmiAdapter.wagmiConfig, {
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
