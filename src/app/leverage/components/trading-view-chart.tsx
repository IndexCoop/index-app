import TradingViewWidget from '@/app/leverage/components/trading-view-widget'
import { Token } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'
import { Button } from '@headlessui/react'
import { useAppKit } from '@reown/appkit/react'

type Props = {
  indexToken: Token
}

export function TradingViewChart({ indexToken }: Props) {
  const { isConnected } = useWallet()
  const { open } = useAppKit()

  return (
    <div className='relative h-full w-full'>
      <div className='relative h-full w-full'>
        <TradingViewWidget chartSymbol='INDEX:ETHUSD' indexToken={indexToken} />
        <TradingViewWidget chartSymbol='INDEX:BTCUSD' indexToken={indexToken} />
        <TradingViewWidget
          chartSymbol='BINANCE:ETHBTC'
          indexToken={indexToken}
        />
        <TradingViewWidget
          chartSymbol='VANTAGE:BTCETH'
          indexToken={indexToken}
        />
        <TradingViewWidget
          chartSymbol='COINBASE:SOLUSD'
          indexToken={indexToken}
        />
        <TradingViewWidget
          chartSymbol='COINBASE:SUIUSD'
          indexToken={indexToken}
        />
      </div>
      {!isConnected && (
        <div className='bg-ic-black/95 absolute inset-0 z-20 flex items-center justify-center'>
          <Button
            className='bg-ic-blue-500 dark:bg-ic-blue-300 dark:hover:bg-ic-blue-200 hover:bg-ic-blue-500/90 text-ic-gray-50 dark:text-ic-black block rounded-md px-8 py-1 text-sm font-medium shadow-sm transition-all duration-300 hover:scale-[1.04]'
            onClick={() => open({ view: 'Connect' })}
          >
            Connect
          </Button>
        </div>
      )}
    </div>
  )
}
