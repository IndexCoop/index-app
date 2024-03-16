import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const arcxApiKey = process.env.NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY ?? ''
const gtmParams = {
  id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
}

export function AnalyticsProvider({ children }: Props) {
  const gtmProviderComponent = (
    <GTMProvider state={gtmParams}>{children}</GTMProvider>
  )

  if (!arcxApiKey) {
    return gtmProviderComponent
  }

  return (
    <ArcxAnalyticsProvider apiKey={arcxApiKey}>
      {gtmProviderComponent}
    </ArcxAnalyticsProvider>
  )
}
