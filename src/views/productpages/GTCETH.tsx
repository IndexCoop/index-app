import TokenPage from 'components/token-page/TokenPage'
import { GitcoinStakedETHIndex } from 'constants/tokens'
import { useApy } from 'hooks/useApy'
import { displayFromWei } from 'utils'

const GTCETH = () => {
  const { apy } = useApy(GitcoinStakedETHIndex.symbol)
  const formattedApy = displayFromWei(apy, 2) ?? undefined
  return <TokenPage token={GitcoinStakedETHIndex} apy={formattedApy} />
}

export default GTCETH
