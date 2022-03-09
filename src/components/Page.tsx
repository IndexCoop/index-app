import { Flex } from '@chakra-ui/react'

import Header from './Header'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column' paddingBottom='50px'>
      <Header />
      <Flex w={['inherit', '1024px']} m={['0', '0 auto']} p={['24px', '0']}>
        {props.children}
      </Flex>
    </Flex>
  )
}

export default Page
