import { BalanceProvider } from '@/lib/providers/Balances'
import { ProtectionProvider } from '@/lib/providers/protection'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BalanceProvider>
      <ProtectionProvider>{children}</ProtectionProvider>
    </BalanceProvider>
  )
}
