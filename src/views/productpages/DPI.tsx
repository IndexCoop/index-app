import TokenPage from 'components/token-page/TokenPage'
import { DefiPulseIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const DPI = () => {
  const { dpi } = useMarketData()
  return <TokenPage token={DefiPulseIndex} marketData={dpi || {}} />
}

export default DPI
