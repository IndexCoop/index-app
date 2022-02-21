import ProductPage from 'components/product/ProductPage'
import { GmiIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

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
