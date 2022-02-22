import ProductPage from 'components/product/ProductPage'
import { IMaticFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const IMATICFLIP = () => {
  const { imaticflip } = useMarketData()
  const { imaticflipComponents: imaticFlipComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={IMaticFLIP}
      marketData={imaticflip || {}}
      components={imaticFlipComponents || []}
    />
  )
}

export default IMATICFLIP
