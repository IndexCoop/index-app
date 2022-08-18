import ProductPage from 'components/product/ProductPage'
import { Ethereum2xFlexibleLeverageIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const ETH2xFLI = () => {
  const { ethfli } = useMarketData()
  return (
    <ProductPage
      token={Ethereum2xFlexibleLeverageIndex}
      marketData={ethfli || {}}
      isLeveragedToken={true}
    />
  )
}

export default ETH2xFLI
