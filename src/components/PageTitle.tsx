import { useICColorMode } from 'styles/colors'

import { StackDivider, VStack } from '@chakra-ui/layout'
import { Heading, Text } from '@chakra-ui/react'

interface PageTitleProps {
  title: string
  subtitle: string
}

const PageTitle = (props: PageTitleProps) => {
  const { dividerColor } = useICColorMode()
  return (
    <VStack
      divider={<StackDivider borderColor={dividerColor} />}
      spacing={0}
      align='flex-start'
      mb={['16px', '48px']}
    >
      <Heading as='h2' size='lg'>
        {props.title}
      </Heading>
      <Text>{props.subtitle}</Text>
    </VStack>
  )
}

export default PageTitle
