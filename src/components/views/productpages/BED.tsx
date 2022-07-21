import ProductPage from 'components/product/ProductPage'
import { BedIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const BED = () => {
  const { bed } = useMarketData()
  return <ProductPage token={BedIndex} marketData={bed || {}} />
}

export default BED
