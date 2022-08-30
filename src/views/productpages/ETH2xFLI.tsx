import TokenPage from 'components/token-page/TokenPage'
import { Ethereum2xFlexibleLeverageIndex } from 'constants/tokens'
import { useMarketData } from 'providers/MarketData'

const ETH2xFLI = () => {
  const { ethfli } = useMarketData()
  return (
    <TokenPage
      token={Ethereum2xFlexibleLeverageIndex}
      marketData={ethfli || {}}
      isLeveragedToken={true}
    />
  )
}

export default ETH2xFLI
