import { Flex } from '@chakra-ui/layout'

import Header from './Header'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column' paddingBottom='50px'>
      <Header />
      <Flex w='1024px' m='0 auto'>
        {props.children}
      </Flex>
    </Flex>
  )
}

export default Page
