import ProductPage from 'components/product/ProductPage'
import { Ethereum2xFlexibleLeverageIndex } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

const ETH2xFLI = () => {
  const { ethfli } = useMarketData()
  const { eth2xfliComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={Ethereum2xFlexibleLeverageIndex}
      marketData={ethfli || {}}
      components={eth2xfliComponents || []}
    ></ProductPage>
  )
}

export default ETH2xFLI
