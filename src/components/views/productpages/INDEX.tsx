import ProductPage from 'components/product/ProductPage'
import { IndexToken } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const INDEX = () => {
  const { index } = useMarketData()

  return (
    <ProductPage
      tokenData={IndexToken}
      marketData={index || {}}
      components={[]}
      isLeveragedToken={true}
    />
  )
}

export default INDEX
