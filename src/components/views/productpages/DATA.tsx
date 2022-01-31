import ProductPage from 'components/product/ProductPage'
import { DataIndex } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

const DATA = () => {
  const { data } = useMarketData()
  const { dataComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={DataIndex}
      marketData={data || {}}
      components={dataComponents || []}
    ></ProductPage>
  )
}

export default DATA
