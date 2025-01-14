'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useRefId = () => {
  const searchParams = useSearchParams()

  const queryRefId = useMemo(
    () => searchParams.get('utm_source'),
    [searchParams],
  )
  const storedRefId = useMemo(
    () => sessionStorage.getItem('refId') ?? undefined,
    [],
  )

  if (queryRefId) {
    sessionStorage.setItem('refId', queryRefId)

    return queryRefId
  }

  return storedRefId
}
