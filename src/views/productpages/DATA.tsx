import TokenPage from 'components/token-page/TokenPage'
import { DataIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const DATA = () => {
  const { data } = useMarketData()
  return <TokenPage token={DataIndex} marketData={data || {}} />
}

export default DATA
