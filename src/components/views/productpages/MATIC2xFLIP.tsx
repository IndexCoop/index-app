import ProductPage from 'components/product/ProductPage'
import { Matic2xFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const MATIC2xFLIP = () => {
  const { maticflip } = useMarketData()
  const { matic2xflipComponents: matic2xFlipComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={Matic2xFLIP}
      marketData={maticflip || {}}
      components={matic2xFlipComponents || []}
      isLeveragedToken={true}
    />
  )
}

export default MATIC2xFLIP
