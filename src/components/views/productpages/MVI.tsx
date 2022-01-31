import ProductPage from 'components/product/ProductPage'
import { MetaverseIndex } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

const MVI = () => {
  const { mvi } = useMarketData()
  const { mviComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={MetaverseIndex}
      marketData={mvi || {}}
      components={mviComponents || []}
    ></ProductPage>
  )
}

export default MVI
