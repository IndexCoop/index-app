import { useAppKit } from '@reown/appkit/react'
import { useCallback } from 'react'

import { useAnalytics } from '@/lib/hooks/use-analytics'

export function useCustomAppKit() {
  const { open } = useAppKit()
  const { logEvent } = useAnalytics()

  const openAccountView = useCallback(
    (context: string) => {
      open({ view: 'Account' })
      logEvent('Account Button Clicked', { context })
    },
    [logEvent, open],
  )

  const openConnectView = useCallback(
    (context: string) => {
      open({ view: 'Connect' })
      logEvent('Connect Button Clicked', { context })
    },
    [logEvent, open],
  )

  const openNetworksView = useCallback(
    (context: string) => {
      open({ view: 'Networks' })
      logEvent('Networks Button Clicked', { context })
    },
    [logEvent, open],
  )

  return {
    openAccountView,
    openConnectView,
    openNetworksView,
  }
}
