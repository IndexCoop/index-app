import TokenPage from 'components/token-page/TokenPage'
import { icETHIndex } from 'constants/tokens'
import { useApy } from 'hooks/useApy'
import { displayFromWei } from 'utils'

const ICETH = () => {
  const { apy } = useApy(icETHIndex.symbol)
  const formattedApy = displayFromWei(apy, 2) ?? undefined
  return <TokenPage token={icETHIndex} apy={formattedApy} />
}

export default ICETH
