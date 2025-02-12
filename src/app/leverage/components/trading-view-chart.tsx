import TradingViewWidget from '@/app/leverage/components/trading-view-widget'
import { Token } from '@/constants/tokens'

type Props = {
  indexToken: Token
}

export function TradingViewChart({ indexToken }: Props) {
  return (
    <>
      <TradingViewWidget chartSymbol='INDEX:ETHUSD' indexToken={indexToken} />
      <TradingViewWidget chartSymbol='INDEX:BTCUSD' indexToken={indexToken} />
      <TradingViewWidget chartSymbol='BINANCE:ETHBTC' indexToken={indexToken} />
      <TradingViewWidget chartSymbol='VANTAGE:BTCETH' indexToken={indexToken} />
    </>
  )
}
