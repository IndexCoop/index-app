import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'

const white = '#F6F1E4'
const gray = '#848484'

interface ProgramComp {
  caption: string
  value: string
  valueExtra?: string
}

export interface Program {
  title: string
  isActive: boolean
  staked: ProgramComp
  apy: ProgramComp
  unclaimed: ProgramComp
}

const NumberBox = (props: { isActive: boolean; component: ProgramComp }) => {
  const { isActive, component } = props

  return (
    <Flex direction='column'>
      <Flex align='end'>
        <Text color={isActive ? white : gray} fontSize='4xl' fontWeight='200'>
          {component.value}
        </Text>
        <Text color={isActive ? white : gray} fontSize='sm' ml='2' pb='9px'>
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
  const { isActive, title, apy, staked, unclaimed } = props.program
  const comps = [staked, apy, unclaimed]

  return (
    <Flex direction='column'>
      <Heading as='h3' size='md'>
        {title}
      </Heading>
      <Box border='1px solid #F7F1E4' mt='6px' />
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
        <Button mr='6' isDisabled={!isActive}>
          Approve Staking
        </Button>
        <Button mr='6' isDisabled={!isActive}>
          Claim
        </Button>
        <Button isDisabled={!isActive}>Unstake & Claim</Button>
      </Flex>
    </Flex>
  )
}

export default MiningProgram
