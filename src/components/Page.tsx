import { Flex } from '@chakra-ui/layout'

import Header from './Header'
import Navigation from './Navigation'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column' paddingBottom='50px'>
      <Header />
      <Navigation />
      <Flex>{props.children}</Flex>
    </Flex>
  )
}

export default Page
