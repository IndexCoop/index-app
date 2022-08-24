import ProductPage from 'components/product/ProductPage'
import { DefiPulseIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const DPI = () => {
  const { dpi } = useMarketData()
  return <ProductPage token={DefiPulseIndex} marketData={dpi || {}} />
}

export default DPI
