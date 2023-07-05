import { colors, useColorStyles } from '@/lib/styles/colors'

import { WarningTwoIcon } from '@chakra-ui/icons'
import { CircularProgress, Flex, Text } from '@chakra-ui/react'

type RethSupplyCapProps = {
  // cap: string
  // totalSupply: string
  // onChange: (isChecked: boolean) => void
}

// TODO: check would reach cap limit
// TODO: cap limit reached

// TODO: add states available | capReached | capWillExceed

export const RethSupplyCap = (props: RethSupplyCapProps) => {
  const { isDarkMode, styles } = useColorStyles()
  const backgroundColor = isDarkMode ? colors.icGray3 : colors.icGray1
  // const { cap, totalSupply } = props
  const available = '1250'
  const totalSupplyPercent = 75
  const totalSupply = '29.77K'
  const cap = '40,000.00'
  return (
    <Flex align='flex-start' borderRadius='10' direction='column' mt='32px'>
      <Flex
        align='flex-start'
        border='1px solid'
        borderColor={styles.border}
        borderRadius={'16px'}
        direction={'column'}
        p='16px'
        width='100%'
      >
        <Flex align='center'>
          <CircularProgress
            size='44px'
            color={colors.icGray4}
            thickness='12px'
            value={totalSupplyPercent}
          />
          <Flex direction={'column'} ml='16px'>
            <Text color={styles.text} fontSize='12px'>
              Total supplied
            </Text>
            <Text color={styles.text} fontSize='16px'>
              {`${totalSupply} of ${cap} rETH`}
            </Text>
          </Flex>
        </Flex>
        <Text color={styles.text} fontSize='16px' fontWeight='bold' mt='16px'>
          {`${available} icRETH is available to mint.`}
        </Text>
      </Flex>
    </Flex>
  )
}
