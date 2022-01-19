import { Box, Flex, Link, Text } from '@chakra-ui/react'

import MiningProgram from 'components/mining/MiningProgram'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const LiquidityMining = () => {
  const { dpi } = useMarketData()
  const programs = ['', '']

  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='Liquidity Mining Programs'
          subtitle='Earn rewards for supplying liquidity for Index Coop products'
        />
        <Flex direction='column' w='50%'>
          {programs.map((program, index) => {
            return (
              <Box key={index} my='30'>
                <MiningProgram />
              </Box>
            )
          })}
        </Flex>
      </Box>
    </Page>
  )
}

export default LiquidityMining
