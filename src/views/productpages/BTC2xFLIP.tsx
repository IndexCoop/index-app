import TokenPage from 'components/token-page/TokenPage'
import { Bitcoin2xFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const BTC2xFLIP = () => {
  const { btcflip } = useMarketData()
  return (
    <TokenPage
      token={Bitcoin2xFLIP}
      marketData={btcflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default BTC2xFLIP
