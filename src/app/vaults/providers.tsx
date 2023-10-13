import { BalanceProvider } from '@/lib/providers/Balances'
import { ProtectionProvider } from '@/lib/providers/Protection'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BalanceProvider>
      <ProtectionProvider>{children}</ProtectionProvider>
    </BalanceProvider>
  )
}
