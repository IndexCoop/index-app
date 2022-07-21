import ProductPage from 'components/product/ProductPage'
import { Matic2xFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const MATIC2xFLIP = () => {
  const { maticflip } = useMarketData()
  return (
    <ProductPage
      token={Matic2xFLIP}
      marketData={maticflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default MATIC2xFLIP
