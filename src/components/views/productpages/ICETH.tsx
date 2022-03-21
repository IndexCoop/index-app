import ProductPage from 'components/product/ProductPage'
import { icETHIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const ICETH = () => {
  const { iceth } = useMarketData()
  const { icethComponents } = useSetComponents()
  return (
    <ProductPage
      tokenData={icETHIndex}
      marketData={iceth || {}}
      components={icethComponents || []}
    />
  )
}

export default ICETH
