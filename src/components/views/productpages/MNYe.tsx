import ProductPage from 'components/product/ProductPage'
import { MNYeIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const MNY = () => {
  const { mnye } = useMarketData()
  const { mnyeComponents, mnyeVAssets } = useSetComponents()

  return (
    <ProductPage
      tokenData={MNYeIndex}
      marketData={mnye || {}}
      isLeveragedToken={true}
      components={mnyeComponents || []}
      vAssets={mnyeVAssets || []}
    />
  )
}

export default MNY
