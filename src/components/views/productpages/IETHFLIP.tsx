import ProductPage from 'components/product/ProductPage'
import { IEthereumFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'

const IETHFLIP = () => {
  const { iethflip } = useMarketData()
  return (
    <ProductPage
      token={IEthereumFLIP}
      marketData={iethflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default IETHFLIP
