import TokenPage from 'components/token-page/TokenPage'
import { IBitcoinFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const BTC2xFLI = () => {
  const { ibtcflip } = useMarketData()
  return (
    <TokenPage
      token={IBitcoinFLIP}
      marketData={ibtcflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default BTC2xFLI
