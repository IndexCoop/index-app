import { colors, useICColorMode } from 'styles/colors'
import { useAccount } from 'wagmi'

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import StakingModal from 'components/mining/StakingModal'
import { StakingBalances } from 'hooks/useBalance'
import {
  LiquidityMiningProps,
  useLiquidityMining,
} from 'providers/LiquidityMining/LiquidityMiningProvider'
import { displayFromWei } from 'utils'

const gray = '#848484'

interface ProgramBase {
  caption: string
  value: string
}
interface ProgramUnclaimed extends ProgramBase {
  valueExtra: string
  unclaimedBalanceKey: keyof StakingBalances
}
interface ProgramStaked extends ProgramBase {
  valueExtra: string
  stakedBalanceKey: keyof StakingBalances
  underlyingBalanceKey: keyof StakingBalances
}

export interface Program {
  title: string
  subtitle?: string
  isActive: boolean
  staked: ProgramStaked
  apy: ProgramBase
  unclaimed: ProgramUnclaimed
  liquidityMiningKey: keyof LiquidityMiningProps
}

const NumberBox = (props: {
  isActive: boolean
  component: Partial<ProgramStaked>
  isDarkMode: boolean
}) => {
  const { isActive, component } = props
  const activeTextColor = props.isDarkMode ? colors.white : colors.black
  const textColor = isActive ? activeTextColor : gray

  return (
    <Flex direction='column'>
      <Flex align='end'>
        <Text color={textColor} fontSize='4xl' fontWeight='200'>
          {component.value}
        </Text>
        <Text color={textColor} fontSize='sm' ml='2' pb='9px'>
          {component?.valueExtra ?? ''}
        </Text>
      </Flex>
      <Text color={textColor} fontSize='xs' mt='6px'>
        {component.caption}
      </Text>
    </Flex>
  )
}

const MiningProgram = (props: {
  program: Program
  balances: StakingBalances
}) => {
  const { balances } = props
  const {
    isActive,
    title,
    subtitle,
    apy,
    staked,
    liquidityMiningKey,
    unclaimed,
  } = props.program
  const { address } = useAccount()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const liquidityMining = useLiquidityMining()
  console.log(liquidityMining, 'liquidityMining')
  const { dividerColor, isDarkMode } = useICColorMode()
  console.log('RENDER', balances)

  const program = liquidityMining[liquidityMiningKey]
  if (!program) return <></>

  const {
    apy: stakingApy,
    isApproved,
    isApproving,
    isPoolActive,
    onApprove,
    onStake,
    onHarvest,
    onUnstakeAndHarvest,
  } = program

  props.program.isActive = Boolean(isPoolActive)

  if (staked.stakedBalanceKey) {
    staked.value = displayFromWei(balances[staked.stakedBalanceKey], 5) ?? '0.0'
  }

  apy.value = `${(isPoolActive && stakingApy) || '0.0'}%`

  if (unclaimed.unclaimedBalanceKey) {
    unclaimed.value =
      displayFromWei(balances[unclaimed.unclaimedBalanceKey], 5) ?? '0.0'
  }

  const comps = [staked, apy, unclaimed]

  const StakeButton = () => {
    if (!address) {
      return (
        <Button
          disabled
          mr={['0', '6']}
          variant='secondary'
          w={['100%', 'inherit']}
        >
          Stake
        </Button>
      )
    }

    if (!isApproved) {
      return (
        <Button
          disabled={
            balances[staked.underlyingBalanceKey]?.toNumber() === 0 ||
            isApproving ||
            !isActive
          }
          mr={['0', '6']}
          onClick={() => onApprove()}
          w={['100%', 'inherit']}
        >
          {!isApproving ? 'Approve staking' : 'Approving staking...'}
        </Button>
      )
    }

    if (isApproved) {
      return (
        <Button
          mr={['0', '6']}
          isDisabled={!isActive}
          onClick={() => onOpen()}
          w={['100%', 'inherit']}
        >
          Stake
        </Button>
      )
    }
  }

  return (
    <>
      <Flex direction='column'>
        <Heading as='h3' size='md'>
          {title}
        </Heading>
        <Box border='1px solid #fff' borderColor={dividerColor} mt='6px' />
        <Heading as='h5' size='xs' mt='6px' fontWeight='normal'>
          {subtitle}
        </Heading>
        <Flex mt='3' flexWrap='wrap' w='100%'>
          {comps.map((comp, index) => {
            return (
              <Box key={index} mr='16' mb={['16px', '0']}>
                <NumberBox
                  isActive={isActive}
                  isDarkMode={isDarkMode}
                  component={comp}
                />
              </Box>
            )
          })}
        </Flex>
        <Flex mt={['4', '8']} flexWrap={['wrap', 'inherit']}>
          {isActive && (
            <Flex flexWrap={['wrap', 'inherit']} w='100%'>
              {StakeButton()}
              <Button
                mt={['4', '0']}
                mr={['0', '6']}
                isDisabled={!address || Number(staked.value) <= 0}
                onClick={() => onHarvest()}
                w={['100%', 'inherit']}
              >
                Claim
              </Button>
            </Flex>
          )}
          <Button
            isDisabled={!address || Number(staked.value) <= 0}
            onClick={() => onUnstakeAndHarvest()}
            mt={['4', '0']}
            w={['100%', 'inherit']}
          >
            Unstake & Claim
          </Button>
        </Flex>
      </Flex>
      <StakingModal
        isOpen={isOpen}
        onClose={onClose}
        onStake={onStake}
        stakeAbleBalance={balances[staked.underlyingBalanceKey]}
        stakeSymbol={staked.valueExtra}
      />
    </>
  )
}

export default MiningProgram
