import ProductPage from 'components/product/ProductPage'
import { Bitcoin2xFlexibleLeverageIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const BTC2xFLI = () => {
  const { btcfli } = useMarketData()
  return (
    <ProductPage
      token={Bitcoin2xFlexibleLeverageIndex}
      marketData={btcfli || {}}
      isLeveragedToken={true}
    />
  )
}

export default BTC2xFLI
