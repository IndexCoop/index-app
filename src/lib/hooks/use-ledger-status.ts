export function useLedgerStatus() {
  if (typeof window === 'undefined') return { isRunningInLedgerLive: false }
  const searchParams = new URLSearchParams(window.location.search)
  const isRunningInLedgerLive = searchParams.get('embedded') === 'true'
  return { isRunningInLedgerLive }
}
