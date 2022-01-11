import Page from 'components/Page'
import ProductPage from 'components/product/ProductPage'
import { DefiPulseIndex } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const DPI = () => {
  const { dpi } = useMarketData()
  return (
    <ProductPage tokenData={DefiPulseIndex} marketData={dpi || {}}>
      <div>DPI Test Test</div>
    </ProductPage>
  )
}

export default DPI
