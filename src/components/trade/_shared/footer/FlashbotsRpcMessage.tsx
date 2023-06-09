import { colors, useColorStyles } from '@/lib/styles/colors'

import { Flex, Text } from '@chakra-ui/layout'

import { addMEVProtectionChain } from '@/lib/utils/chains'

const FlashbotsRpcMessage = () => {
  const { isDarkMode, styles } = useColorStyles()
  const backgroundColor = isDarkMode ? colors.icGray3 : colors.icGray1
  const onClick = async () => {
    const ethereum = window.ethereum
    if (!ethereum) return
    console.log('adding...')
    await addMEVProtectionChain(ethereum)
  }
  return (
    <Flex
      background={backgroundColor}
      borderRadius='10'
      cursor={'pointer'}
      my='16px'
      p='16px'
      onClick={onClick}
    >
      <Text color={styles.text} fontSize='12px'>
        It is highly recommended to use a MEV protected RPC for Flash minting
        and redeeming. Click here to add the MEV Blocker network to your wallet
        - if supported.
      </Text>
    </Flex>
  )
}

export default FlashbotsRpcMessage
