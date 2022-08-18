import ProductPage from 'components/product/ProductPage'
import { DataIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const DATA = () => {
  const { data } = useMarketData()
  return <ProductPage token={DataIndex} marketData={data || {}} />
}

export default DATA
