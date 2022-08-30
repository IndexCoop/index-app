import TokenPage from 'components/token-page/TokenPage'
import { JPGIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const JPG = () => {
  const { jpg } = useMarketData()

  return (
    <TokenPage
      token={JPGIndex}
      marketData={jpg || {}}
      isLeveragedToken={true}
    />
  )
}

export default JPG
