import { useColorStyles } from '@/lib/styles/colors'

import { Box, Flex, Text } from '@chakra-ui/react'

import { useNetwork } from '@/lib/hooks/useNetwork'

export const NetworkBadge = () => {
  const { styles } = useColorStyles()
  const { name } = useNetwork()
  const networkName = name ?? 'Unsupported Network'
  return (
    <Flex align='center' direction='row' justify='center'>
      <Text fontSize={'sm'} fontWeight='500'>
        You are connected to
      </Text>
      <Box
        bg={styles.backgroundInverted}
        borderRadius='16px'
        px='8px'
        py='2px'
        ml='4px'
      >
        <Text color={styles.textInverted} fontSize='xs' fontWeight='500'>
          {networkName}
        </Text>
      </Box>
    </Flex>
  )
}
