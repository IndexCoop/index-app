import TokenPage from 'components/token-page/TokenPage'
import { icETHIndex } from 'constants/tokens'
import { useIcEthApy } from 'hooks/useIcEthApy'
import { useMarketData } from 'providers/MarketData'
import { displayFromWei } from 'utils'

const ICETH = () => {
  const { iceth } = useMarketData()
  const { apy } = useIcEthApy()
  const formattedApy = displayFromWei(apy, 2) ?? undefined

  return (
    <TokenPage
      token={icETHIndex}
      marketData={iceth || {}}
      isLeveragedToken={true}
      apy={formattedApy}
    />
  )
}

export default ICETH
