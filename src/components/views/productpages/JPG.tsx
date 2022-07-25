import ProductPage from 'components/product/ProductPage'
import { JPGIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const JPG = () => {
  const { jpg } = useMarketData()

  return (
    <ProductPage
      token={JPGIndex}
      marketData={jpg || {}}
      isLeveragedToken={true}
    />
  )
}

export default JPG
