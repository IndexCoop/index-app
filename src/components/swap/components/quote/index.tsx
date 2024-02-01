import { QuoteNotAvailable } from './not-available'

interface Quote {
  isBestQuote: boolean
  inputAmount: string
  outputAmount: string
  feesGas: string
  feesTotal: string
}

// TODO: isLoading?
type QuoteProps = {
  type: string
  isSelected: boolean
  quote: Quote | null
}

export const QuoteResult = (props: QuoteProps) => {
  return props.quote ? <></> : <QuoteNotAvailable type={props.type} />
}
