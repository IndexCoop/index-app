import { useEffect, useState } from 'react'

import { Box, Button, Flex } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import MiningProgram, { Program } from 'components/mining/MiningProgram'
import WarningMessage from 'components/mining/WarningMessage'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { setMainnet } from 'constants/chains'
import { MAINNET_CHAIN_DATA } from 'utils/connectors'

const programs: Program[] = [
  {
    title: 'GMI Staking',
    subtitle: 'Active January 10th, 2022 to March 10th, 2022',
    isActive: true,
    staked: {
      caption: 'Staked GMI Tokens',
      value: '', // '10.2 ',
      valueExtra: 'GMI',
      stakedBalanceKey: 'stakedGmi2022Balance',
      underlyingBalanceKey: 'gmiBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '', // '40.2%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '', // '421.23',
      valueExtra: 'INDEX',
      unclaimedBalanceKey: 'unclaimedGmi2022Balance',
    },
    liquidityMiningKey: 'gmi2022',
  },
  {
    title: 'MVI Liquidity Program',
    subtitle: 'Active August 20th, 2021 to September 19th, 2021',
    isActive: false,
    staked: {
      caption: 'Staked ETH/MVI Uniswap LP Tokens',
      value: '', // '0.0',
      valueExtra: 'ETH / MVI',
      stakedBalanceKey: 'stakedUniswapEthMvi2021LpBalance',
      underlyingBalanceKey: 'uniswapEthMviLpBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '', // '0.0%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '', // '0.0',
      valueExtra: 'INDEX',
      unclaimedBalanceKey: 'unclaimedUniswapEthMvi2021LpBalance',
    },
    liquidityMiningKey: 'uniswapEthMvi2021',
  },
  // TODO need to be able to onUnstakeAndHarvest
  // Uniswap V3 DPI-ETH Liquidity Program
  // Active August 20th, 2021 - September 4th, 2021
  {
    title: 'DPI Liquidity Program',
    subtitle: 'Active July 13th, 2021 to August 12th, 2021',
    isActive: false,
    staked: {
      caption: 'Staked ETH/DPI Uniswap LP Tokens',
      value: '', // '10.2 ',
      valueExtra: 'ETH / DPI',
      stakedBalanceKey: 'stakedUniswapEthDpi2021LpBalance',
      underlyingBalanceKey: 'uniswapEthDpiLpBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '', // '40.2%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '', // '421.23',
      valueExtra: 'INDEX',
      unclaimedBalanceKey: 'unclaimedUniswapEthDpi2021LpBalance',
    },
    liquidityMiningKey: 'uniswapEthDpi2021',
  },
  {
    title: 'DPI Liquidity Program',
    subtitle: 'Active October 7th, 2020 to December 6th, 2020',
    isActive: false,
    staked: {
      caption: 'Staked ETH/DPI Uniswap LP Tokens',
      value: '', // '10.2 ',
      valueExtra: 'ETH / DPI',
      stakedBalanceKey: 'stakedUniswapEthDpi2020LpBalance',
      underlyingBalanceKey: 'uniswapEthDpiLpBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '', // '40.2%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '', // '421.23',
      valueExtra: 'INDEX',
      unclaimedBalanceKey: 'unclaimedUniswapEthDpi2020LpBalance',
    },
    liquidityMiningKey: 'uniswapEthDpi2020',
  },
]
// uniswapEthDpi2020?: LiquidityMiningValues
// uniswapEthDpi2021?: LiquidityMiningValues
// uniswapEthMvi2021?: LiquidityMiningValues
// gmi2022?: LiquidityMiningValues

const LiquidityMining = () => {
  const { account, chainId, library } = useEthers()

  const [showFarms, setShowFarms] = useState(true)
  const [warning, setWarning] = useState<string | null>(null)

  const closeWarningMessage = () => {
    setWarning(null)
  }

  useEffect(() => {
    if (chainId !== MAINNET_CHAIN_DATA.chainId) {
      setWarning('Liquidity Mining is only available on Mainnet')
      setShowFarms(false)
    } else {
      setWarning(null)
      setShowFarms(true)
    }
  }, [chainId])

  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='Liquidity Mining Programs'
          subtitle='Earn rewards for supplying liquidity for Index Coop products'
        />
        {warning && (
          <WarningMessage message={warning} closeAction={closeWarningMessage} />
        )}
        <Flex>
          <Flex direction='column' w='100%' maxWidth={800} mx='auto'>
            {showFarms &&
              programs.map((program, index) => {
                return (
                  <Box key={index} my='10'>
                    <MiningProgram program={program} />
                  </Box>
                )
              })}
            {!showFarms && (
              <Box my='10'>
                <Button
                  isFullWidth
                  onClick={() => setMainnet(library, account)}
                >
                  Switch to Mainnet
                </Button>
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </Page>
  )
}

export default LiquidityMining
