import ProductPage from 'components/product/ProductPage'
import { IBitcoinFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const BTC2xFLI = () => {
  const { ibtcflip } = useMarketData()
  const { ibtcflipComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={IBitcoinFLIP}
      marketData={ibtcflip || {}}
      components={ibtcflipComponents || []}
    />
  )
}

export default BTC2xFLI
