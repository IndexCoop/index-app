import ProductPage from 'components/product/ProductPage'
import { MetaverseIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const MVI = () => {
  const { mvi } = useMarketData()
  const { mviComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={MetaverseIndex}
      marketData={mvi || {}}
      components={mviComponents || []}
    />
  )
}

export default MVI
