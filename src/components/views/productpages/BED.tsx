import ProductPage from 'components/product/ProductPage'
import { BedIndex } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

const BED = () => {
  const { bed } = useMarketData()
  const { bedComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={BedIndex}
      marketData={bed || {}}
      components={bedComponents || []}
    ></ProductPage>
  )
}

export default BED
