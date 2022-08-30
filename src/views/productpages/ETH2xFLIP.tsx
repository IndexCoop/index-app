import TokenPage from 'components/token-page/TokenPage'
import { Ethereum2xFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const ETH2xFLIP = () => {
  const { ethflip } = useMarketData()
  return (
    <TokenPage
      token={Ethereum2xFLIP}
      marketData={ethflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default ETH2xFLIP
