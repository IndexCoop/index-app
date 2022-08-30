import TokenPage from 'components/token-page/TokenPage'
import { Matic2xFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const MATIC2xFLIP = () => {
  const { maticflip } = useMarketData()
  return (
    <TokenPage
      token={Matic2xFLIP}
      marketData={maticflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default MATIC2xFLIP
