import { Flex, Link, Spacer } from '@chakra-ui/react'

import { Logo } from './logo'
import Navigation from './navigation'

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
          <Link
            href='https://indexcoop.com/'
            _hover={{
              textDecoration: 'none',
            }}
            flexGrow={1}
          >
            <Logo />
          </Link>
        </Flex>
        <Spacer />
        <Flex align='center' justifyContent={'flex-end'}>
          <Navigation />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Header
