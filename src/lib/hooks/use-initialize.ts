'use client'

import { useUpsertUser } from '@/lib/hooks/use-upsert-user'
import { useUtmParams } from '@/lib/hooks/use-utm-params'

// This hook is meant to initialize every client-side dependency
// the application needs the user arrives on the app.
// E.g: Database information, query parameters
export const useInitialize = () => {
  useUpsertUser()
  useUtmParams()
}
