import { BalanceProvider } from '@/lib/providers/Balances'
import { ProtectionProvider } from '@/lib/providers/protection'
import { SelectedTokenProvider } from '@/lib/providers/selected-token-provider'
import { SlippageProvider } from '@/lib/providers/slippage'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SelectedTokenProvider>
      <BalanceProvider>
        <SlippageProvider>
          <ProtectionProvider>{children}</ProtectionProvider>
        </SlippageProvider>
      </BalanceProvider>
    </SelectedTokenProvider>
  )
}
