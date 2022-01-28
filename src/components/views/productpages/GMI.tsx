import ProductPage from 'components/product/ProductPage'
import { GmiIndex } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

const GMI = () => {
  const { gmi } = useMarketData()
  const { gmiComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={GmiIndex}
      marketData={gmi || {}}
      components={gmiComponents || []}
    ></ProductPage>
  )
}

export default GMI
