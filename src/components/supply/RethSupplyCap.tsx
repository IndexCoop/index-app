import { CircularProgress, Flex, Text } from '@chakra-ui/react'

import { colors, useColorStyles } from '@/lib/styles/colors'

interface RethSupplyCapProps {
  formatted: {
    // note that this is available icRETH
    available: string
    // these are cap and total supply of rETH on aave
    cap: string
    totalSupply: string
  }
  totalSupplyPercent: number
}

// TODO: add states available | capReached | capWillExceed

export const RethSupplyCap = (props: RethSupplyCapProps) => {
  const { styles } = useColorStyles()
  const { formatted, totalSupplyPercent } = props
  const { available, cap, totalSupply } = formatted
  return (
    <Flex align='flex-start' borderRadius='10' direction='column' w='100%'>
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
      </Flex>
      <Flex
        align='flex-start'
        border='1px solid'
        borderColor={styles.border}
        borderRadius={'16px'}
        direction={'column'}
        mt='16px'
        p='16px'
        w='100%'
      >
        <Text color={colors.icGray3} fontSize='14px' fontWeight='400'>
          Available to mint
        </Text>
        <Text color={colors.icBlack} fontSize='16px' fontWeight='700'>
          {`${available} icRETH`}
        </Text>
      </Flex>
    </Flex>
  )
}
