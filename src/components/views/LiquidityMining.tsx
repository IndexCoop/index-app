import { Box, Flex, Link, Text } from '@chakra-ui/react'

import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const LiquidityMining = () => {
  const { dpi } = useMarketData()

  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='Liquidity Mining Programs'
          subtitle='Earn rewards for supplying liquidity for Index Coop products'
        />
      </Box>
    </Page>
  )
}

export default LiquidityMining
