import { ProtectionProvider } from '@/lib/providers/protection'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProtectionProvider>{children}</ProtectionProvider>
}
