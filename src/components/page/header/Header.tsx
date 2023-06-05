import { useICColorMode } from 'styles/colors'

import { Flex, Link } from '@chakra-ui/react'

import {
  IndexLogoBlack,
  IndexLogoFullBlack,
  IndexLogoFullWhite,
  IndexLogoWhite,
} from 'assets'

import Navigation from './Navigation'

const Header = () => {
  const { isDarkMode } = useICColorMode()
  const backgroundColor = isDarkMode
    ? 'rgba(15, 23, 23, 0.6)'
    : 'rgba(252, 255, 255, 0.82)'

  return (
    <Flex
      as='header'
      backgroundColor={backgroundColor}
      backdropFilter='saturate(180%) blur(5px)'
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
        <Link
          href='https://indexcoop.com/'
          _hover={{
            textDecoration: 'none',
          }}
          flexGrow={1}
        >
          <Flex marginRight={['', '', '', '20px']}>
            <Logo />
          </Flex>
        </Link>
        <Navigation />
      </Flex>
    </Flex>
  )
}

const Logo = () => {
  const { isDarkMode } = useICColorMode()

  if (window.innerWidth > 1350) {
    const logo = isDarkMode ? IndexLogoFullWhite : IndexLogoFullBlack
    return <img alt='Index Coop Logo' src={logo} height='30px' width='130px' />
  }

  const logo = isDarkMode ? IndexLogoWhite : IndexLogoBlack
  return <img alt='Index Coop Logo' src={logo} height='30px' width='30px' />
}

export default Header
