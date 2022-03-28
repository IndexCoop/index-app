import { Flex, Image, Link } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/system'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoFullBlack from 'assets/index-logo-full-black.png'
import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

import Navigation from './Navigation'

const Header = () => {
  return (
    <Flex
      justifyContent='space-between'
      p={[
        '16px 8px 8px 24px',
        null,
        '42px 60px 60px 60px',
        '64px 80px 80px 80px',
      ]}
      w='100vw'
      alignItems='center'
    >
      <Link
        href='https://indexcoop.com/'
        _hover={{
          textDecoration: 'none',
        }}
        flexGrow='1'
      >
        <Logo />
      </Link>
      <Navigation />
    </Flex>
  )
}

const Logo = () => {
  const { colorMode } = useColorMode()
  const isDarkMode = colorMode === 'dark'
  let logo = isDarkMode ? indexLogoWhite : indexLogoBlack

  if (window.innerWidth > 1350) {
    logo = isDarkMode ? indexLogoFullWhite : indexLogoFullBlack
  }

  return (
    <Image
      src={logo}
      alt='Index Coop Logo'
      minWidth='24px'
      height='40px'
      mr={['', '', '', '20px']}
    />
  )
}

export default Header
