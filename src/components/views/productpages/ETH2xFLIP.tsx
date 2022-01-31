import ProductPage from 'components/product/ProductPage'
import { Ethereum2xFLIP } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

const ETH2xFLIP = () => {
  const { ethflip } = useMarketData()
  const { eth2xflipComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={Ethereum2xFLIP}
      marketData={ethflip || {}}
      components={eth2xflipComponents || []}
    ></ProductPage>
  )
}

export default ETH2xFLIP
