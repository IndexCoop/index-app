import { useAtom } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { UtmParam, utmParamsAtom } from '@/app/store/utm-atoms'

export const useUtmParams = () => {
  const searchParams = useSearchParams()
  const [utmParams, setUtmParams] = useAtom(utmParamsAtom)

  useEffect(() => {
    const newParams: Partial<Record<UtmParam, string>> = {}

    searchParams.forEach((value, key) => {
      if (
        [
          'utm_source',
          'utm_medium',
          'utm_campaign',
          'utm_term',
          'utm_content',
        ].includes(key)
      ) {
        newParams[key.replace('utm_', '') as UtmParam] = value
      }
    })

    if (Object.keys(newParams).length > 0) {
      setUtmParams((prev) => ({ ...prev, ...newParams }))
    }
  }, [searchParams, setUtmParams])

  return utmParams
}
