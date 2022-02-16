import ProductPage from 'components/product/ProductPage'
import { DefiPulseIndex } from 'constants/productTokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const DPI = () => {
  const { dpi } = useMarketData()
  const { dpiComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={DefiPulseIndex}
      marketData={dpi || {}}
      components={dpiComponents || []}
    ></ProductPage>
  )
}

export default DPI
