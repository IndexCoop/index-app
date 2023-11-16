import { colors, useColorStyles } from '@/lib/styles/colors'

import { WarningTwoIcon } from '@chakra-ui/icons'
import { Checkbox, Flex, Text } from '@chakra-ui/react'

type OverrideProps = {
  onChange: (isChecked: boolean) => void
}

export const Override = (props: OverrideProps) => {
  const { isDarkMode, styles } = useColorStyles()
  const backgroundColor = isDarkMode ? colors.icGray3 : colors.icGray1
  return (
    <Flex
      align='flex-start'
      background={backgroundColor}
      borderRadius='10'
      direction='column'
      p='16px'
    >
      <Flex align='center'>
        <WarningTwoIcon color={styles.text} />
        <Text color={styles.text} fontSize='14px' mx='16px'>
          This tx would likely fail. Check override and press the trade button
          again to execute anyway.
        </Text>
      </Flex>
      <Flex mt='8px'>
        <Checkbox onChange={(e) => props.onChange(e.target.checked)}>
          Override?
        </Checkbox>
      </Flex>
    </Flex>
  )
}
