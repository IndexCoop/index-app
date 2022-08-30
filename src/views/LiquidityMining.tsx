import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Box, Button, Flex } from '@chakra-ui/react'

import MiningProgram, { Program } from 'components/mining/MiningProgram'
import WarningMessage from 'components/mining/WarningMessage'
import Page from 'components/page/Page'
import PageTitle from 'components/page/PageTitle'
import { MAINNET } from 'constants/chains'
import { useLiquidityMiningBalances } from 'hooks/useBalance'
import LiquidityMiningProvider from 'providers/LiquidityMining'

const programs: Program[] = [
  {
    title: 'GMI Staking',
    subtitle: 'Active January 10th, 2022 to March 10th, 2022',
    isActive: false,
    staked: {
      caption: 'Staked GMI Tokens',
      value: '0.00000',
      valueExtra: 'GMI',
      stakedBalanceKey: 'stakedGmi2022Balance',
      underlyingBalanceKey: 'gmiBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '0.0%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '0.00000',
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
      value: '0.00000',
      valueExtra: 'ETH / MVI',
      stakedBalanceKey: 'stakedUniswapEthMvi2021LpBalance',
      underlyingBalanceKey: 'uniswapEthMviLpBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '0.0%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '0.00000',
      valueExtra: 'INDEX',
      unclaimedBalanceKey: 'unclaimedUniswapEthMvi2021LpBalance',
    },
    liquidityMiningKey: 'uniswapEthMvi2021',
  },
  {
    title: 'DPI Liquidity Program',
    subtitle: 'Active July 13th, 2021 to August 12th, 2021',
    isActive: false,
    staked: {
      caption: 'Staked ETH/DPI Uniswap LP Tokens',
      value: '0.00000',
      valueExtra: 'ETH / DPI',
      stakedBalanceKey: 'stakedUniswapEthDpi2021LpBalance',
      underlyingBalanceKey: 'uniswapEthDpiLpBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '0.0%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '0.00000',
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
      value: '0.00000',
      valueExtra: 'ETH / DPI',
      stakedBalanceKey: 'stakedUniswapEthDpi2020LpBalance',
      underlyingBalanceKey: 'uniswapEthDpiLpBalance',
    },
    apy: {
      caption: '(volatile)',
      value: '0.0%',
    },
    unclaimed: {
      caption: 'Unclaimed INDEX in pool',
      value: '0.00000',
      valueExtra: 'INDEX',
      unclaimedBalanceKey: 'unclaimedUniswapEthDpi2020LpBalance',
    },
    liquidityMiningKey: 'uniswapEthDpi2020',
  },
]

const LiquidityMining = () => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const chainId = chain?.id
  const isMainnet = chainId === MAINNET.chainId
  const balances = useLiquidityMiningBalances()

  const showFarms = isMainnet
  const warning = isMainnet
    ? null
    : 'Liquidity Mining is only available on Mainnet'

  return (
    <LiquidityMiningProvider>
      <Page>
        <Box w='100vw'>
          <PageTitle
            title='Liquidity Mining Programs'
            subtitle='Earn rewards for supplying liquidity for Index Coop products'
          />
          {warning && (
            <WarningMessage message={warning} closeAction={() => {}} />
          )}
          <Flex px={['20px', '20px', '20px', '0']}>
            <Flex direction='column' w='100%' maxWidth={800} mx='auto'>
              {showFarms &&
                programs.map((program, index) => {
                  return (
                    <Box key={index} my='10' zIndex='1'>
                      <MiningProgram program={program} balances={balances} />
                    </Box>
                  )
                })}
              {!showFarms && (
                <Box my='10'>
                  <Button onClick={() => switchNetwork?.(MAINNET.chainId)}>
                    Switch to Mainnet
                  </Button>
                </Box>
              )}
            </Flex>
          </Flex>
        </Box>
      </Page>
    </LiquidityMiningProvider>
  )
}

export default LiquidityMining
