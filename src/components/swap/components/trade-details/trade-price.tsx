interface TradePriceProps {
  comparisonLabel: string
  usdLabel: string
}

export const TradePrice = ({ comparisonLabel, usdLabel }: TradePriceProps) => {
  return (
    <div className='xs:flex-row flex flex-col items-start'>
      <p className='text-ic-gray-600 text-xs font-medium'>{comparisonLabel}</p>
      <p className='text-ic-gray-400 ml-0 text-xs font-medium sm:ml-1'>
        {usdLabel}
      </p>
    </div>
  )
}
