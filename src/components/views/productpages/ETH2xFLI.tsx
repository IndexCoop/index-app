import ProductPage from 'components/product/ProductPage'
import { Ethereum2xFlexibleLeverageIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const ETH2xFLI = () => {
  const { ethfli } = useMarketData()
  const { eth2xfliComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={Ethereum2xFlexibleLeverageIndex}
      marketData={ethfli || {}}
      components={eth2xfliComponents || []}
    />
  )
}

export default ETH2xFLI
