import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'

const white = '#F6F1E4'
const gray = '#848484'

const NumberBox = (props: { isActive: boolean }) => {
  const { isActive } = props

  return (
    <Flex direction='column'>
      <Flex align='end'>
        <Text color={isActive ? white : gray} fontSize='4xl' fontWeight='200'>
          10.2
        </Text>
        <Text color={isActive ? white : gray} fontSize='sm' ml='2' pb='9px'>
          ETH/DPI
        </Text>
      </Flex>
      <Text color={white} fontSize='xs' mt='6px'>
        Staked ETH/DPI Uniswap LP Tokens
      </Text>
    </Flex>
  )
}

const MiningProgram = (props: { isActive: boolean }) => {
  const { isActive } = props
  const numbers = ['', '', '']

  return (
    <Flex direction='column'>
      <Heading as='h3' size='md'>
        DPI Liquidity Program
      </Heading>
      <Flex w='100%' mt='3'>
        {numbers.map((num, index) => {
          return (
            <Box key={index} mr='16'>
              <NumberBox isActive={isActive} />
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
