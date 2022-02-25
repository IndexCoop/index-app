import { StackDivider, VStack } from '@chakra-ui/layout'
import { Heading, Text, useColorMode } from '@chakra-ui/react'

interface PageTitleProps {
  title: string
  subtitle: string
}

const PageTitle = (props: PageTitleProps) => {
  const { colorMode } = useColorMode()
  const dividerColor = colorMode === 'dark' ? 'white' : 'black'
  return (
    <VStack
      divider={<StackDivider borderColor={dividerColor} />}
      spacing={0}
      align='flex-start'
      mb='48px'
    >
      <Heading as='h2' size='lg'>
        {props.title}
      </Heading>
      <Text>{props.subtitle}</Text>
    </VStack>
  )
}

export default PageTitle
