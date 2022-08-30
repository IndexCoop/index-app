import { useColorStyles } from 'styles/colors'

import { StackDivider, VStack } from '@chakra-ui/layout'
import { Heading, Text } from '@chakra-ui/react'

interface PageTitleProps {
  title: string
  subtitle: string
}

const PageTitle = (props: PageTitleProps) => {
  const { styles } = useColorStyles()
  return (
    <VStack
      divider={
        <StackDivider mx={[0, '20px', '20px', 0]} borderColor={styles.border} />
      }
      spacing={0}
      align='flex-start'
      mb={['16px', '24px', '36px', '48px']}
    >
      <Heading as='h2' size='lg' px={[0, '20px', '20px', 0]}>
        {props.title}
      </Heading>
      <Text mx={[0, '20px', '20px', 0]}>{props.subtitle}</Text>
    </VStack>
  )
}

export default PageTitle
