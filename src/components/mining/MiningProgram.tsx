import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'

const NumberBox = () => {
  return (
    <Flex direction='column'>
      <Flex align='end'>
        <Text fontSize='4xl' fontWeight='200'>
          10.2
        </Text>
        <Text fontSize='sm' ml='2' pb='9px'>
          ETH/DPI
        </Text>
      </Flex>
      <Text fontSize='xs' mt='6px'>
        Staked ETH/DPI Uniswap LP Tokens
      </Text>
    </Flex>
  )
}

// TODO: state active|disabled

const MiningProgram = () => {
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
              <NumberBox />
            </Box>
          )
        })}
      </Flex>
      <Flex mt='8'>
        <Button mr='6'>Approve Staking</Button>
        <Button mr='6'>Claim</Button>
        <Button>Unstake & Claim</Button>
      </Flex>
    </Flex>
  )
}

export default MiningProgram
