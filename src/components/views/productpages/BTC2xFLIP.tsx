import ProductPage from 'components/product/ProductPage'
import { Bitcoin2xFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const BTC2xFLIP = () => {
  const { btcflip } = useMarketData()
  const { btc2xflipComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={Bitcoin2xFLIP}
      marketData={btcflip || {}}
      components={btc2xflipComponents || []}
    />
  )
}

export default BTC2xFLIP
