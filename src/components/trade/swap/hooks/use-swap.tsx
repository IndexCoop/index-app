import { ZeroExQuote } from '@/lib/hooks/useBestQuote'

interface SwapData {
  //   outputTokenAmountFormatted: string
  gasCostsUsd: number
}

export function useSwap(quote0x: ZeroExQuote | null): SwapData {
  const reset = () => {
    // TODO:
  }

  const gasCostsUsd = quote0x?.gasCostsInUsd ?? 0

  return {
    gasCostsUsd,
  }
}
