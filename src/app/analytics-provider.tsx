'use client'

import { ArcxAnalyticsProvider } from '@arcxmoney/analytics'
import ReactGA from "react-ga4";
import { ReactNode, useEffect } from 'react'

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
