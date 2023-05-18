export function useLedgerStatus() {
  const searchParams = new URLSearchParams(window.location.search)
  const isRunningInLedgerLive = searchParams.get('embedded') === 'true'
  return { isRunningInLedgerLive }
}
