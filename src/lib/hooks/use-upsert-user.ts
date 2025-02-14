'use client' // Required for Next.js App Router

import { watchAccount } from '@wagmi/core'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import {
  fetchUserAtom,
  userMetadataAtom,
} from '@/app/store/user-metadata-atoms'
import { wagmiAdapter } from '@/lib/utils/wagmi'

export const useUpsertUser = () => {
  const [userMetadata] = useAtom(userMetadataAtom)
  const fetchUser = useSetAtom(fetchUserAtom)

  useEffect(() => {
    const unwatch = watchAccount(wagmiAdapter.wagmiConfig, {
      async onChange(account, prevAccount) {
        if (account.address && prevAccount.address !== account.address) {
          fetchUser(account.address)
        }
      },
    })

    return () => unwatch()
  }, [fetchUser])

  return userMetadata
}
