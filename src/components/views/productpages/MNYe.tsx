import ProductPage from 'components/product/ProductPage'
import { MNYeIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const MNY = () => {
  const { mnye } = useMarketData()

  return (
    <ProductPage
      token={MNYeIndex}
      marketData={mnye || {}}
      isLeveragedToken={true}
    />
  )
}

export default MNY
