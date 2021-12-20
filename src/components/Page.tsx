import { Flex } from '@chakra-ui/layout'
import Header from './Header'

const Page = (props: { children: any }) => {
  return (
    <Flex direction='column'>
      <Header />
      {props.children}
    </Flex>
  )
}

export default Page
