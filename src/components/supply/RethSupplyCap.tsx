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

function getColorForProgress(progress: number): string {
  if (progress === 100) {
    return colors.icBlue5
  }
  if (progress > 100) {
    return colors.icRed
  }
  return colors.icBlue4
}

export const RethSupplyCap = (props: RethSupplyCapProps) => {
  const { styles } = useColorStyles()
  const { formatted, totalSupplyPercent } = props
  const { available, cap, totalSupply } = formatted
  const progressColor = getColorForProgress(totalSupplyPercent)
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
          <Flex ml='32px'>
            <Flex align='center' justify={'center'}>
              <CircularProgress
                position={'absolute'}
                size='72px'
                color={progressColor}
                thickness='8px'
                value={totalSupplyPercent}
                zIndex={0}
              />
              <Text
                position={'absolute'}
                zIndex={1}
                color={colors.icGray3}
                fontSize='12px'
                fontWeight='700'
              >
                {`${totalSupplyPercent.toFixed(2)}%`}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={'column'} ml='48px'>
            <Text color={colors.icGray3} fontSize='14px' fontWeight='400'>
              Total supplied
            </Text>
            <Text color={styles.text} fontSize='16px' fontWeight='700'>
              {`${totalSupply} of ${cap}`}
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
