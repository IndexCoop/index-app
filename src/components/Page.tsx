import { Flex, useBreakpointValue } from '@chakra-ui/react'

import Header from './Header'
import MobileDisclaimer from './MobileDisclaimer'

const Page = (props: { children?: JSX.Element }) => {
  const isMobile = useBreakpointValue({ base: true, lg: false })

  if (isMobile) {
    return <MobileDisclaimer />
  }

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
