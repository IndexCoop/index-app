import TokenPage from 'components/token-page/TokenPage'
import { IMaticFLIP } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const IMATICFLIP = () => {
  const { imaticflip } = useMarketData()
  return (
    <TokenPage
      token={IMaticFLIP}
      marketData={imaticflip || {}}
      isLeveragedToken={true}
    />
  )
}

export default IMATICFLIP
