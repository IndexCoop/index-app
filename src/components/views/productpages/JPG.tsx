import ProductPage from 'components/product/ProductPage'
import { JPGIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const JPG = () => {
  const { jpg } = useMarketData()
  const { jpgComponents } = useSetComponents()

  return (
    <ProductPage
      tokenData={JPGIndex}
      marketData={jpg || {}}
      components={jpgComponents || []}
      isLeveragedToken={true}
    />
  )
}

export default JPG
