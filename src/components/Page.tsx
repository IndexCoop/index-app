import { Flex } from '@chakra-ui/react'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column' mb='50px'>
      <Flex
        w={['390px', '500px', '820px', '1024px']}
        m={['0', '0 auto']}
        p={['24px', '0', '24px', '0']}
      >
        {props.children}
      </Flex>
    </Flex>
  )
}

export default Page
