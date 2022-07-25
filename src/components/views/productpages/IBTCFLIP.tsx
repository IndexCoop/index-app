import ProductPage from 'components/product/ProductPage'
import { IBitcoinFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const BTC2xFLI = () => {
  const { ibtcflip } = useMarketData()
  return (
    <ProductPage
      token={IBitcoinFLIP}
      marketData={ibtcflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default BTC2xFLI
