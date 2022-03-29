import ProductPage from 'components/product/ProductPage'
import { icETHIndex } from 'constants/tokens'
import { useIcEthApy } from 'hooks/useIcEthApy'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'
import { displayFromWei } from 'utils'

const ICETH = () => {
  const { iceth } = useMarketData()
  const { icethComponents } = useSetComponents()
  const { apy } = useIcEthApy() // TODO: Need to get this from hook and convert to a displayable string
  const formattedApy = displayFromWei(apy, 2) ?? undefined

  return (
    <ProductPage
      tokenData={icETHIndex}
      marketData={iceth || {}}
      components={icethComponents || []}
      isLeveragedToken={true}
      apy={formattedApy}
    />
  )
}

export default ICETH
