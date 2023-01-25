import TokenPage from 'components/token-page/TokenPage'
import { DiversifiedStakedETHIndex } from 'constants/tokens'
import { useApy } from 'hooks/useApy'
import { displayFromWei } from 'utils'

const DSETH = () => {
  const { apy } = useApy(DiversifiedStakedETHIndex.symbol)
  const formattedApy = displayFromWei(apy, 2) ?? undefined
  return <TokenPage token={DiversifiedStakedETHIndex} apy={formattedApy} />
}

export default DSETH
