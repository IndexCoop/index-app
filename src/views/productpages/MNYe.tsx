import TokenPage from 'components/token-page/TokenPage'
import { MNYeIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const MNY = () => {
  const { mnye } = useMarketData()

  return (
    <TokenPage
      token={MNYeIndex}
      marketData={mnye || {}}
      isLeveragedToken={true}
    />
  )
}

export default MNY
