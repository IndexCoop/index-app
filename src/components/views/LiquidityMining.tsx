import { useEffect, useState } from 'react'
import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import AllAssets from 'components/mining/AllAssets'
import MiningProgram, { Program } from 'components/mining/MiningProgram'
import WarningMessage from 'components/mining/WarningMessage'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { setMainnet } from 'constants/chains'
import { MAINNET_CHAIN_DATA } from 'utils/connectors'

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

const LiquidityMining = () => {
  const { account, chainId, library } = useEthers()

  const [showFarms, setShowFarms] = useState(true)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    if (chainId !== MAINNET_CHAIN_DATA.chainId) {
      setWarning('Liquidity Mining is only available on Mainnet')
      setShowFarms(false)
    } else {
      setWarning(null)
      setShowFarms(true)
    }
  }, [chainId])

  const closeWarningMessage = () => {
    setWarning(null)
  }

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
          <Flex direction='column' w='50%'>
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
          <Spacer />
          <Flex minW='420px' my='10'>
            <AllAssets
              isActive={showFarms}
              capitalInFarms='$1.24bln'
              indexPrice='$645.90'
            />
          </Flex>
        </Flex>
      </Box>
    </Page>
  )
}

export default LiquidityMining
