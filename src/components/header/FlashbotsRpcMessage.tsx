import { Flex, Link, Text } from '@chakra-ui/layout'

const FlashbotsRpcMessage = () => (
  <Link
    href='https://docs.flashbots.net/flashbots-protect/rpc/quick-start/#how-to-use-flashbots-protect-rpc-in-metamask'
    isExternal
  >
    <Flex background='#FEF2CC' borderRadius='10' mt='16px' p='16px'>
      <Text color='#000000'>
        To avoid failed transactions - with the current volatile market
        situations or - in general we recommend to use the Flashbot RPC. Learn
        how to add it here.
      </Text>
    </Flex>
  </Link>
)

export default FlashbotsRpcMessage
