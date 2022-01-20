import { Box, Flex } from '@chakra-ui/react'

import MiningProgram from 'components/mining/MiningProgram'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const LiquidityMining = () => {
  const { dpi } = useMarketData()
  const programs = [{ isActive: true }, { isActive: false }]

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
                <MiningProgram isActive={program.isActive} />
              </Box>
            )
          })}
        </Flex>
      </Box>
    </Page>
  )
}

export default LiquidityMining
