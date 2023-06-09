import { Flex } from '@chakra-ui/react'

const Page = (props: { children?: JSX.Element }) => {
  return (
    <Flex direction='column' mb='50px'>
      <Flex
        w={['390px', '500px', '820px', '1024px']}
        m={['0', '0 auto']}
        p={[
          '100px 16px 0px 16px',
          '100px 16px 0px 16px',
          '128px 0 0 0',
          '128px 0 0 0',
        ]}
      >
        {props.children}
      </Flex>
    </Flex>
  )
}

export default Page
