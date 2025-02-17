'use client'

import { ArcxAnalyticsProvider } from '@0xarc-io/analytics'
import { GoogleTagManager } from '@next/third-parties/google'
import { ReactNode, useEffect } from 'react'
import ReactGA from 'react-ga4'

type Props = {
  children: ReactNode
}

const arcxApiKey = process.env.NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY ?? ''
const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID

export function AnalyticsProvider({ children }: Props) {
  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '')
  }, [])

  if (!arcxApiKey) {
    return children
  }

  return (
    <ArcxAnalyticsProvider apiKey={arcxApiKey}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {children}
    </ArcxAnalyticsProvider>
  )
}
