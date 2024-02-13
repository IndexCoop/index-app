import { QuoteType } from '@/lib/hooks/use-best-quote/types'

export interface QuoteDisplay {
  type: QuoteType
  isBestQuote: boolean
  inputAmount: string
  outputAmount: string
  feesGas: string
  feesTotal: string
}
