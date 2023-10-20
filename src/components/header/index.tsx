import { Flex, Link, Spacer } from '@chakra-ui/react'

import { Logo } from './logo'
import Navigation from './navigation'

const Header = () => {
  return (
    <Flex
      as='header'
      bg='purple'
      backdropFilter='saturate(120%) blur(5px)'
      p={[
        '16px 16px 16px 24px',
        null,
        '32px 60px 32px 60px',
        '32px 80px 32px 80px',
      ]}
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
