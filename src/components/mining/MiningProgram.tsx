import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import StakingModal from 'components/mining/StakingModal'
import {
  LiquidityMiningProps,
  useLiquidityMining,
} from 'contexts/LiquidityMining/LiquidityMiningProvider'
import { Balances, useBalances } from 'hooks/useBalances'
import { displayFromWei } from 'utils'

const white = '#F6F1E4'
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
  const textColor = isActive ? white : gray

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
      <Text color={white} fontSize='xs' mt='6px'>
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
  const { isOpen, onClose, onOpen } = useDisclosure()
  const balances = useBalances()
  const liquidityMining = useLiquidityMining()
  // const { status } = useWallet()

  const program = liquidityMining[liquidityMiningKey]
  if (!program) return <></> // better
  const {
    isApproved = true,
    isApproving = false,
    onApprove,
    onStake,
    onHarvest,
    onUnstakeAndHarvest,
  } = program

  // const { gmiRewardsApy } = usePrices() // maybe here ????

  if (staked.stakedBalanceKey) {
    staked.value = displayFromWei(balances[staked.stakedBalanceKey], 5)
  }
  if (unclaimed.unclaimedBalanceKey) {
    unclaimed.value = displayFromWei(balances[unclaimed.unclaimedBalanceKey], 5)
  }

  const comps = [staked, apy, unclaimed]

  const StakeButton = () => {
    // if (status !== 'connected') {
    //   return <Button disabled mr='6' variant='secondary'>Stake</Button>
    // }

    if (!isApproved) {
      return (
        <Button
          disabled={isApproving || !isActive}
          mr='6'
          onClick={onApprove}
          variant={
            isApproving ? 'secondary' : 'default'
            // isApproving || status !== 'connected' ? 'secondary' : 'default'
          }
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
        <Box border='1px solid #F7F1E4' mt='6px' />
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
          {StakeButton()}
          <Button
            mr='6'
            isDisabled={Number(staked.value) <= 0}
            onClick={() => onHarvest()}
          >
            Claim
          </Button>
          <Button
            isDisabled={Number(staked.value) <= 0}
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
