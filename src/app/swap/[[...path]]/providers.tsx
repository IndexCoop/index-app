import { BalanceProvider } from '@/lib/providers/Balances'
import { MarketDataProvider } from '@/lib/providers/MarketData'
import { ProtectionProvider } from '@/lib/providers/Protection'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MarketDataProvider>
      <BalanceProvider>
        <ProtectionProvider>{children}</ProtectionProvider>
      </BalanceProvider>
    </MarketDataProvider>
  )
}
