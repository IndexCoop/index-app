import ProductPage from 'components/product/ProductPage'
import { IMaticFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const IMATICFLIP = () => {
  const { imaticflip } = useMarketData()
  return (
    <ProductPage
      token={IMaticFLIP}
      marketData={imaticflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default IMATICFLIP
