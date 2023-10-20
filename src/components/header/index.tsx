import { Flex, Spacer } from '@chakra-ui/react'

import { Connect } from './connect'
import { Logo } from './logo'

const Header = () => {
  return (
    <Flex
      as='header'
      backdropFilter='saturate(120%) blur(5px)'
      // boxShadow='0px 2px 3px 0px rgba(0, 0, 0, 0.17);'
      p={['24px 32px']}
      position='fixed'
      top='0px'
      w='100vw'
      zIndex='2'
    >
      <Flex align='center' justifyContent='space-between' w='100%'>
        <Flex marginRight={['', '', '', '20px']}>
          <Logo />
        </Flex>
        <Spacer />
        <Connect />
      </Flex>
    </Flex>
  )
}

export default Header
