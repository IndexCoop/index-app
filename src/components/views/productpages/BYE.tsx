import ProductPage from 'components/product/ProductPage'
import { BYEIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const BYE = () => {
  const { bye } = useMarketData()
  const { mnyeComponents: mnyComponents } = useSetComponents()

  return (
    <ProductPage
      tokenData={BYEIndex}
      marketData={bye || {}}
      components={mnyComponents || []}
    />
  )
}

export default BYE
