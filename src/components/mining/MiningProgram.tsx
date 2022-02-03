import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

// import StakingModal from 'components/mining/StakingModal'
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
interface ProgramValueExtra extends ProgramBase {
  valueExtra: string
}
interface ProgramBalance extends ProgramValueExtra {
  stakedBalanceKey: keyof Balances
  underlyingBalanceKey: keyof Balances
}

export interface Program {
  title: string
  subtitle?: string
  isActive: boolean
  staked: ProgramBalance
  apy: ProgramBase
  unclaimed: ProgramValueExtra
  liquidityMiningKey: keyof LiquidityMiningProps
}

const NumberBox = (props: {
  isActive: boolean
  component: Partial<ProgramBalance>
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
  const { isOpen, onClose } = useDisclosure()
  const balances = useBalances()
  const liquidityMining = useLiquidityMining()

  const program = liquidityMining[liquidityMiningKey]

  // const { gmiRewardsApy } = usePrices() // maybe here ????

  // get underlying balance here for staking modal?

  if (staked.stakedBalanceKey) {
    staked.value = displayFromWei(balances[staked.stakedBalanceKey], 5)
  }
  // unclaimed.value = 'TODO'
  const comps = [staked, apy, unclaimed]

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
          <Button mr='6' onClick={() => program?.onStake('23.32')}>
            TEST Stake
          </Button>
          {/* TODO */}
          <Button mr='6' isDisabled={!isActive}>
            Approve Staking
          </Button>
          <Button
            mr='6'
            isDisabled={Number(staked.value) <= 0}
            onClick={() => program?.onHarvest()}
          >
            Claim
          </Button>
          <Button
            isDisabled={Number(staked.value) <= 0}
            onClick={() => program?.onUnstakeAndHarvest()}
          >
            Unstake & Claim
          </Button>
        </Flex>
      </Flex>
      {/* stakeable balance */}
      {/* <StakingModal
        isOpen={isOpen}
        onClose={onClose}
        onStake={program.onStake}
      /> */}
    </>
  )
}

export default MiningProgram
