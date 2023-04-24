import TokenPage from 'components/token-page/TokenPage'
import { MoneyMarketIndex } from 'constants/tokens'
import { useApy } from 'hooks/useApy'
import { displayFromWei } from 'utils'

const ICSMMT = () => {
  const { apy } = useApy(MoneyMarketIndex.symbol)
  const formattedApy = displayFromWei(apy, 2) ?? undefined
  return <TokenPage token={MoneyMarketIndex} apy={formattedApy} />
}

export default ICSMMT
