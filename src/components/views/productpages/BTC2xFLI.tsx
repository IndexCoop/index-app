import ProductPage from 'components/product/ProductPage'
import { Bitcoin2xFlexibleLeverageIndex } from 'constants/productTokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const BTC2xFLI = () => {
  const { btcfli } = useMarketData()
  const { btc2xfliComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={Bitcoin2xFlexibleLeverageIndex}
      marketData={btcfli || {}}
      components={btc2xfliComponents || []}
    ></ProductPage>
  )
}

export default BTC2xFLI
