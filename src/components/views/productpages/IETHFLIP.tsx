import ProductPage from 'components/product/ProductPage'
import { IEthereumFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const IETHFLIP = () => {
  const { iethflip } = useMarketData()
  const { iethFlipComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={IEthereumFLIP}
      marketData={iethflip || {}}
      components={iethFlipComponents || []}
    />
  )
}

export default IETHFLIP
