import ProductPage from 'components/product/ProductPage'
import { GmiIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const GMI = () => {
  const { gmi } = useMarketData()
  return <ProductPage token={GmiIndex} marketData={gmi || {}} />
}

export default GMI
