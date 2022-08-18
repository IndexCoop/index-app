import ProductPage from 'components/product/ProductPage'
import { IndexToken } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const INDEX = () => {
  const { index } = useMarketData()

  return (
    <ProductPage
      token={IndexToken}
      marketData={index || {}}
      isLeveragedToken={true}
    />
  )
}

export default INDEX
