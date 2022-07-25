import ProductPage from 'components/product/ProductPage'
import { icETHIndex } from 'constants/tokens'
import { useIcEthApy } from 'hooks/useIcEthApy'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { displayFromWei } from 'utils'

const ICETH = () => {
  const { iceth } = useMarketData()
  const { apy } = useIcEthApy()
  const formattedApy = displayFromWei(apy, 2) ?? undefined

  return (
    <ProductPage
      token={icETHIndex}
      marketData={iceth || {}}
      isLeveragedToken={true}
      apy={formattedApy}
    />
  )
}

export default ICETH
