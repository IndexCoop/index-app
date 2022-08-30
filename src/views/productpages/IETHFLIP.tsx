import TokenPage from 'components/token-page/TokenPage'
import { IEthereumFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const IETHFLIP = () => {
  const { iethflip } = useMarketData()
  return (
    <TokenPage
      token={IEthereumFLIP}
      marketData={iethflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default IETHFLIP
