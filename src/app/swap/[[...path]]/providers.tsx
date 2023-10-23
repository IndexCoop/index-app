import { BalanceProvider } from '@/lib/providers/Balances'
import { ProtectionProvider } from '@/lib/providers/Protection'
import { SlippageProvider } from '@/lib/providers/Slippage'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BalanceProvider>
      <SlippageProvider>
        <ProtectionProvider>{children}</ProtectionProvider>
      </SlippageProvider>
    </BalanceProvider>
  )
}
