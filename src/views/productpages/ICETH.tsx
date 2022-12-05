import TokenPage from 'components/token-page/TokenPage'
import { icETHIndex } from 'constants/tokens'
import { useIcEthApy } from 'hooks/useIcEthApy'
import { displayFromWei } from 'utils'

const ICETH = () => {
  const { apy } = useIcEthApy()
  const formattedApy = displayFromWei(apy, 2) ?? undefined
  return <TokenPage token={icETHIndex} apy={formattedApy} />
}

export default ICETH
