import TokenPage from 'components/token-page/TokenPage'
import { DiversifiedStakedETHIndex } from 'constants/tokens'
import { useApy } from 'hooks/useApy'
import { displayFromWei } from 'utils'

const DSETH = () => {
  const { apy } = useApy(DiversifiedStakedETHIndex.symbol)
  // FIXME: APY needs to be divided by 100
  const formattedApy = displayFromWei(apy.div(100), 2) ?? undefined
  return <TokenPage token={DiversifiedStakedETHIndex} apy={formattedApy} />
}

export default DSETH
