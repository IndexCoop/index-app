import TokenPage from 'components/token-page/TokenPage'
import { MetaverseIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const MVI = () => {
  const { mvi } = useMarketData()
  return <TokenPage token={MetaverseIndex} marketData={mvi || {}} />
}

export default MVI
