import TokenPage from 'components/token-page/TokenPage'
import { GmiIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const GMI = () => {
  const { gmi } = useMarketData()
  return <TokenPage token={GmiIndex} marketData={gmi || {}} />
}

export default GMI
