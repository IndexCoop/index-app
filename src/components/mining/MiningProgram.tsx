import { colors } from 'styles/colors'

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import StakingModal from 'components/mining/StakingModal'
import { Balances, useBalances } from 'hooks/useBalances'
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
  unclaimedBalanceKey: keyof Balances
}
interface ProgramStaked extends ProgramBase {
  valueExtra: string
  stakedBalanceKey: keyof Balances
  underlyingBalanceKey: keyof Balances
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
}) => {
  const { isActive, component } = props
  const textColor = isActive ? colors.white : gray

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
      <Text color={colors.white} fontSize='xs' mt='6px'>
        {component.caption}
      </Text>
    </Flex>
  )
}

const MiningProgram = (props: { program: Program }) => {
  const {
    isActive,
    title,
    subtitle,
    apy,
    staked,
    liquidityMiningKey,
    unclaimed,
  } = props.program
  const balances = useBalances()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { account } = useEthers()
  const liquidityMining = useLiquidityMining()

  const { colorMode } = useColorMode()
  const dividerColor = colorMode === 'dark' ? 'white' : 'black'

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

  apy.value = `${stakingApy ?? '0.0'}%`

  if (unclaimed.unclaimedBalanceKey) {
    unclaimed.value =
      displayFromWei(balances[unclaimed.unclaimedBalanceKey], 5) ?? '0.0'
  }

  const comps = [staked, apy, unclaimed]

  const StakeButton = () => {
    if (!account) {
      return (
        <Button disabled mr='6' variant='secondary'>
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
          mr='6'
          onClick={() => onApprove()}
        >
          {!isApproving ? 'Approve staking' : 'Approving staking...'}
        </Button>
      )
    }

    if (isApproved) {
      return (
        <Button mr='6' isDisabled={!isActive} onClick={() => onOpen()}>
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
        <Flex w='100%' mt='3'>
          {comps.map((comp, index) => {
            return (
              <Box key={index} mr='16'>
                <NumberBox isActive={isActive} component={comp} />
              </Box>
            )
          })}
        </Flex>
        <Flex mt='8'>
          {isActive && (
            <>
              {StakeButton()}
              <Button
                mr='6'
                isDisabled={!account || Number(staked.value) <= 0}
                onClick={() => onHarvest()}
              >
                Claim
              </Button>
            </>
          )}
          <Button
            isDisabled={!account || Number(staked.value) <= 0}
            onClick={() => onUnstakeAndHarvest()}
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
