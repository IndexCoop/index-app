import { Flex } from '@chakra-ui/layout'

import Header from './Header'
import Navigation from './Navigation'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column'>
      <Header />
      <Navigation />
      <Flex>{props.children}</Flex>
    </Flex>
  )
}

export default Page
