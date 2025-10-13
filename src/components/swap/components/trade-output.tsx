import { Token } from '@/constants/tokens'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'

import { FormattedQuoteDisplay } from '../hooks/use-swap/formatters/result'

import { Caption } from './caption'
import { QuoteResult } from './quote-result'
import { SelectorButton } from './selector-button'

interface TradeOutputProps {
  caption: string
  selectedToken: Token
  selectedQuote: QuoteType | null
  quotes: FormattedQuoteDisplay[]
  onSelectQuote: (quoteType: QuoteType) => void
  onSelectToken: () => void
}

export const TradeOutput = (props: TradeOutputProps) => {
  const { selectedQuote, selectedToken } = props
  return (
    <div className='bg-ic-white border-ic-gray-100 flex flex-col rounded-xl border p-4'>
      <Caption caption={props.caption} />
      <div className='flex w-full justify-end'>
        <SelectorButton
          image={selectedToken.image}
          symbol={selectedToken.symbol}
          onClick={props.onSelectToken}
        />
      </div>
      <div className='flex flex-col gap-2 pt-5'>
        {props.quotes.length > 0 && (
          <p className='text-ic-gray-600 text-xs font-medium'>
            Select your preferred route
          </p>
        )}
        {props.quotes.map((formattedQuote) => (
          <QuoteResult
            key={formattedQuote.type}
            type={formattedQuote.type}
            isLoading={formattedQuote.isLoading}
            isSelected={selectedQuote === formattedQuote.quote?.type}
            quote={formattedQuote.quote ?? null}
            onClick={() => {
              if (formattedQuote.quote) {
                props.onSelectQuote(formattedQuote.quote.type)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
