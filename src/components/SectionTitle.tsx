import { Box, StackDivider, VStack } from '@chakra-ui/layout'
import { Heading } from '@chakra-ui/react'

interface SectionTitleProps {
  title: string
}

const SectionTitle = (props: SectionTitleProps) => {
  return (
    <Box flex='1'>
      <VStack
        divider={<StackDivider borderColor='white' />}
        spacing={2}
        align='flex-start'
      >
        <Heading as='h3' size='md'>
          {props.title}
        </Heading>
        <Box />
      </VStack>
    </Box>
  )
}

export default SectionTitle
