import { useState } from 'react'

import { colors, useColorStyles } from 'styles/colors'

import {
  Button,
  Divider,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react'

export const SignUp = () => {
  const { isDarkMode, styles } = useColorStyles()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Styling
  const backgroundColor = isDarkMode ? colors.icGray4 : colors.icGray1
  const textColor = isDarkMode ? colors.white : colors.black

  return (
    <Flex
      bg={backgroundColor}
      border='1px solid gray'
      borderColor={styles.border}
      borderRadius={'16px'}
      direction={'column'}
      mt='24px'
      p='16px 32px'
    >
      <Text color={textColor} mb='4px' mt='12px'>
        Never miss an update from the Index Coop?
      </Text>
      <Input
        border='1px solid'
        borderColor={'gray'}
        mt='4px'
        placeholder='Add discord, email or telegram'
      />
      <Button
        bg={styles.background}
        border='none'
        mt={'16px'}
        isLoading={isSubmitting}
        type='submit'
      >
        Submit
      </Button>
    </Flex>
  )
}

export const Survey = () => {
  const { isDarkMode, styles } = useColorStyles()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Styling
  const backgroundColor = isDarkMode ? colors.icGray4 : colors.icGray1
  const textColor = isDarkMode ? colors.white : colors.black

  return (
    <Flex
      bg={backgroundColor}
      border='1px solid gray'
      borderColor={styles.border}
      borderRadius={'16px'}
      direction={'column'}
      minWidth={'200px'}
      p='32px'
    >
      <Text color={textColor} mb='4px'>
        How do you like the app?
      </Text>
      <Flex justify={'space-between'}>
        <Text fontSize='3xl' opacity={'0.5'}>
          😒
        </Text>
        <Text fontSize='3xl' opacity={'0.5'}>
          😕
        </Text>
        <Text fontSize='3xl' opacity={'0.5'}>
          😐
        </Text>
        <Text fontSize='3xl' opacity={'0.5'}>
          🙂
        </Text>
        <Text fontSize='3xl'>🤩</Text>
      </Flex>
      <Divider color='black' orientation='horizontal' py='8px' />
      <Text color={textColor} mb='4px'>
        What's your main use?
      </Text>
      <RadioGroup>
        <VStack align='flex-start'>
          <Radio value='SW'>Swap</Radio>
          <Radio value='FM'>FlashMint</Radio>
          <Radio value='FMSW'>FlashMint + Swap</Radio>
          <Radio value='Other'>Other</Radio>
          <Input
            border='1px solid'
            borderColor={'gray'}
            mt='4px'
            placeholder='Other'
          />
        </VStack>
      </RadioGroup>
      <Divider color='white' orientation='horizontal' py='8px' />
      <Text color={textColor} mb='4px' mt='12px'>
        What do you want added to this app?
      </Text>
      <Input border='1px solid' borderColor={'gray'} mt='4px' placeholder='' />
      <Button
        bg={styles.background}
        border='none'
        mt={6}
        isLoading={isSubmitting}
        type='submit'
      >
        Submit
      </Button>
    </Flex>
  )
}
