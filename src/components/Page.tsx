import { Flex } from '@chakra-ui/layout'

import Header from './Header'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column'>
      <Header />
      <Flex>{props.children}</Flex>
    </Flex>
  )
}

export default Page
