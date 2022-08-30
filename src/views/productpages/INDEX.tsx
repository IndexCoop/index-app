import TokenPage from 'components/token-page/TokenPage'
import { IndexToken } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const INDEX = () => {
  const { index } = useMarketData()

  return (
    <TokenPage
      token={IndexToken}
      marketData={index || {}}
      isLeveragedToken={true}
    />
  )
}

export default INDEX
