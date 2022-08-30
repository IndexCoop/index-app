import TokenPage from 'components/token-page/TokenPage'
import { BedIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const BED = () => {
  const { bed } = useMarketData()
  return <TokenPage token={BedIndex} marketData={bed || {}} />
}

export default BED
