import TokenPage from 'components/token-page/TokenPage'
import { Bitcoin2xFlexibleLeverageIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const BTC2xFLI = () => {
  const { btcfli } = useMarketData()
  return (
    <TokenPage
      token={Bitcoin2xFlexibleLeverageIndex}
      marketData={btcfli || {}}
      isLeveragedToken={true}
    />
  )
}

export default BTC2xFLI
