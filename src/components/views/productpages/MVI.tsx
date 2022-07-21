import ProductPage from 'components/product/ProductPage'
import { MetaverseIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const MVI = () => {
  const { mvi } = useMarketData()
  return <ProductPage token={MetaverseIndex} marketData={mvi || {}} />
}

export default MVI
