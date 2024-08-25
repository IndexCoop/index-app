'use client'

import { ArcxAnalyticsProvider } from '@0xarc-io/analytics'
import { ReactNode, useEffect } from 'react'
import ReactGA from 'react-ga4'

type Props = {
  children: ReactNode
}

const arcxApiKey = process.env.NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY ?? ''

export function AnalyticsProvider({ children }: Props) {
  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '')
  }, [])

  if (!arcxApiKey) {
    return children
  }

  return (
    <ArcxAnalyticsProvider apiKey={arcxApiKey}>
      {children}
    </ArcxAnalyticsProvider>
  )
}
