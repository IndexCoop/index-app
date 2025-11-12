'use client' // Required for Next.js App Router

import { watchAccount } from '@wagmi/core'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import {
  fetchUserAtom,
  userMetadataAtom,
} from '@/app/store/user-metadata-atoms'
import { wagmiAdapter } from '@/lib/utils/wagmi'

export const useUpsertUser = (referralCode: string | null = null) => {
  const [userMetadata] = useAtom(userMetadataAtom)
  const fetchUser = useSetAtom(fetchUserAtom)
  const referralCodeRef = useRef(referralCode)

  // Update ref when referralCode changes
  useEffect(() => {
    referralCodeRef.current = referralCode
  }, [referralCode])

  useEffect(() => {
    const unwatch = watchAccount(wagmiAdapter.wagmiConfig, {
      async onChange(account, prevAccount) {
        // Only if the user just connected or changed account
        if (account.address && prevAccount.address !== account.address) {
          // Get referral code from ref or sessionStorage
          const storedReferral = sessionStorage.getItem('referralCode')
          const finalReferralCode = referralCodeRef.current || storedReferral

          fetchUser({ address: account.address, referredBy: finalReferralCode })
        }
      },
    })

    return () => unwatch()
  }, [fetchUser])

  return userMetadata
}
