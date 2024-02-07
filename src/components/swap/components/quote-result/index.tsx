import { QuoteAvailable } from './available'
import { QuoteNotAvailable } from './not-available'
import { QuoteDisplay } from './types'

type QuoteProps = {
  type: string
  isLoading: boolean
  isSelected: boolean
  quote: QuoteDisplay | null
  onClick: () => void
}

export const QuoteResult = (props: QuoteProps) => {
  const { isLoading, isSelected, quote, type } = props
  return !quote && !isLoading ? (
    <QuoteNotAvailable type={type} />
  ) : (
    <QuoteAvailable
      isLoading={isLoading}
      isSelected={isSelected}
      quote={quote}
      type={type}
      onClick={props.onClick}
    />
  )
}
