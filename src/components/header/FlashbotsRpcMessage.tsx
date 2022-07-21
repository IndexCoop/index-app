import { Flex, Link, Text } from '@chakra-ui/layout'

const FlashbotsRpcMessage = () => (
  <Link
    href='https://docs.flashbots.net/flashbots-protect/rpc/quick-start/#how-to-use-flashbots-protect-rpc-in-metamask'
    isExternal
  >
    <Flex background='#EEEEEE' borderRadius='10' mt='16px' p='16px'>
      <Text color='#000000' fontSize='11px'>
        If you want additional protection from transactions failing, we
        recommend using flashbots RPC. Learn how to add it here.
      </Text>
    </Flex>
  </Link>
)

export default FlashbotsRpcMessage
