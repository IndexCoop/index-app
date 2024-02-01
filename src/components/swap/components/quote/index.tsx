import { QuoteAvailable } from './available'
import { QuoteNotAvailable } from './not-available'
import { Quote } from './types'

// TODO: isLoading?
type QuoteProps = {
  type: string
  isSelected: boolean
  quote: Quote | null
}

export const QuoteResult = (props: QuoteProps) => {
  const { isSelected, quote, type } = props
  return quote ? (
    <QuoteAvailable isSelected={isSelected} quote={quote} type={type} />
  ) : (
    <QuoteNotAvailable type={type} />
  )
}
