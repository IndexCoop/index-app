import { SelectedTokenProvider } from '@/lib/providers/selected-token-provider'
import { SlippageProvider } from '@/lib/providers/slippage'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SelectedTokenProvider>
      <SlippageProvider>{children}</SlippageProvider>
    </SelectedTokenProvider>
  )
}
