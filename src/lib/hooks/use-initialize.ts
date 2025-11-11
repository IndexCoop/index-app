'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { QUERY_PARAM_REFERRAL } from '@/constants'
import { useRaffleEpoch } from '@/lib/hooks/use-raffle-epoch'
import { useUpsertUser } from '@/lib/hooks/use-upsert-user'
import { useUtmParams } from '@/lib/hooks/use-utm-params'

// This hook is meant to initialize every client-side dependency
// the application needs the user arrives on the app.
// E.g: Database information, query parameters
export const useInitialize = () => {
  const searchParams = useSearchParams()
  const referralCode = searchParams.get(QUERY_PARAM_REFERRAL)

  useUpsertUser(referralCode)
  useUtmParams()
  useRaffleEpoch()

  // Store referral code in sessionStorage for later use if the user was not yet wallet connected
  useEffect(() => {
    if (referralCode) {
      sessionStorage.setItem('referralCode', referralCode)
    }
  }, [referralCode])
}
