import ProductPage from 'components/product/ProductPage'
import { icETHIndex } from 'constants/tokens'
import { useIcEthApy } from 'hooks/useIcEthApy'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { useSetComponents } from 'providers/SetComponents/SetComponentsProvider'

const ICETH = () => {
  const { iceth } = useMarketData()
  const { icethComponents } = useSetComponents()
  //const { apy } = useIcEthApy() // TODO: Need to get this from hook and convert to a displayable string
  const apy = 7.04
  return (
    <ProductPage
      tokenData={icETHIndex}
      marketData={iceth || {}}
      components={icethComponents || []}
      isLeveragedToken={true}
      apy={apy.toString()}
    />
  )
}

export default ICETH
