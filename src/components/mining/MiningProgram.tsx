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
import { useBalances } from 'hooks/useBalances'
import { displayFromWei } from 'utils'

const white = '#F6F1E4'
const gray = '#848484'

interface ProgramComp {
  caption: string
  value: string
  valueExtra?: string
  stakedBalanceKey?: string
  underlyingBalanceKey?: string
}

export interface Program {
  title: string
  subtitle?: string
  isActive: boolean
  staked: ProgramComp
  apy: ProgramComp
  unclaimed: ProgramComp
  liquidityMiningKey: keyof LiquidityMiningProps
}

const NumberBox = (props: { isActive: boolean; component: ProgramComp }) => {
  const { isActive, component } = props
  const textColor = isActive ? white : gray

  return (
    <Flex direction='column'>
      <Flex align='end'>
        <Text color={textColor} fontSize='4xl' fontWeight='200'>
          {component.value}
        </Text>
        <Text color={textColor} fontSize='sm' ml='2' pb='9px'>
          {component.valueExtra ?? ''}
        </Text>
      </Flex>
      <Text color={white} fontSize='xs' mt='6px'>
        {component.caption}
      </Text>
    </Flex>
  )
}

const MiningProgram = (props: { program: Program }) => {
  const { isActive, title, subtitle, apy, staked, unclaimed } = props.program
  const { isOpen, onClose } = useDisclosure()

  // dynamic via keys in program for staking modal?
  const { gmiBalance, stakedGmi2022Balance } = useBalances()

  const { gmi2022 } = useLiquidityMining()

  // const { gmiRewardsApy } = usePrices() // maybe here ????

  staked.value = displayFromWei(stakedGmi2022Balance, 5)
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
          <Button mr='6' onClick={() => gmi2022?.onStake('23.32')}>
            TEST Stake
          </Button>
          <Button mr='6' isDisabled={!isActive}>
            Approve Staking
          </Button>
          <Button
            mr='6'
            isDisabled={!isActive}
            onClick={() => gmi2022?.onHarvest()}
          >
            Claim
          </Button>
          <Button
            isDisabled={!isActive}
            onClick={() => gmi2022?.onUnstakeAndHarvest()}
          >
            Unstake & Claim
          </Button>
        </Flex>
      </Flex>
      {/* stakeable balance */}
      {/* <StakingModal
        isOpen={isOpen}
        onClose={onClose}
        onStake={gmi2022.onStake}
      /> */}
    </>
  )
}

export default MiningProgram
