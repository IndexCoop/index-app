import { useEffect } from 'react'

import { Flex } from '@chakra-ui/react'

import { logPage } from 'utils/analytics'

const Page = (props: { children?: JSX.Element }) => {
  useEffect(() => {
    logPage(window.location.href)
  }, [])

  return (
    <Flex direction='column' mb='50px'>
      <Flex
        w={['390px', '500px', '820px', '1024px']}
        m={['0', '0 auto']}
        p={[
          '100px 24px 0px 24px',
          '100px 24px 0px 24px',
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
