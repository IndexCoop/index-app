import { Box, Flex } from '@chakra-ui/react'

import MiningProgram, { Program } from 'components/mining/MiningProgram'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const LiquidityMining = () => {
  const { dpi } = useMarketData()

  const programs: Program[] = [
    {
      title: 'DPI Liquidity Program',
      isActive: true,
      staked: {
        caption: 'Staked ETH/DPI Uniswap LP Tokens',
        value: '10.2 ',
        valueExtra: 'ETH / DPI',
      },
      apy: {
        caption: '(volatile)',
        value: '40.2%',
      },
      unclaimed: {
        caption: 'Unclaimed INDEX in pool',
        value: '421.23',
        valueExtra: 'INDEX',
      },
    },
    {
      title: 'MVI Liquidity Program',
      isActive: false,
      staked: {
        caption: 'Staked ETH/MVI Uniswap LP Tokens',
        value: '0.0',
        valueExtra: 'ETH / MVI',
      },
      apy: {
        caption: '(volatile)',
        value: '0.0%',
      },
      unclaimed: {
        caption: 'Unclaimed INDEX in pool',
        value: '0.0',
        valueExtra: 'INDEX',
      },
    },
  ]

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
              <Box key={index} my='10'>
                <MiningProgram program={program} />
              </Box>
            )
          })}
        </Flex>
      </Box>
    </Page>
  )
}

export default LiquidityMining
