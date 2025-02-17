'use client'

import { ArcxAnalyticsProvider } from '@0xarc-io/analytics'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const arcxApiKey = process.env.NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY ?? ''
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID

export function AnalyticsProvider({ children }: Props) {
  return (
    <ArcxAnalyticsProvider apiKey={arcxApiKey}>
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {children}
    </ArcxAnalyticsProvider>
  )
}
