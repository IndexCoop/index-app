import { colors, useColorStyles } from 'styles/colors'

import { Flex, Link, Text } from '@chakra-ui/layout'

const FlashbotsRpcMessage = () => {
  const { isDarkMode, styles } = useColorStyles()
  const backgroundColor = isDarkMode ? colors.icGray3 : colors.icGray1
  return (
    <Link
      color={styles.text}
      href='https://docs.flashbots.net/flashbots-protect/rpc/quick-start/#how-to-use-flashbots-protect-rpc-in-metamask'
      isExternal
    >
      <Flex background={backgroundColor} borderRadius='10' mt='16px' p='16px'>
        <Text color={styles.text} fontSize='11px'>
          If you want additional protection from transactions failing, we
          recommend using flashbots RPC. Learn how to add it here.
        </Text>
      </Flex>
    </Link>
  )
}

export default FlashbotsRpcMessage
