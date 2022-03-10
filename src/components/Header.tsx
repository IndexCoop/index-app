import { Flex, Image, Link, Text } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/system'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoFullBlack from 'assets/index-logo-full-black.png'
import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

import Navigation from './Navigation'

const Header = () => {
  const { colorMode } = useColorMode()

  return (
    <Flex
      justifyContent='space-between'
      m={['16px 8px 8px 24px', '64px 80px 80px 80px']}
      alignItems='center'
    >
      <Link
        href='https://indexcoop.com/'
        _hover={{
          textDecoration: 'none',
        }}
        flexGrow='1'
      >
        <Logo isDarkMode={colorMode === 'dark'} />
      </Link>
      <Navigation />
    </Flex>
  )
}

const Logo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  let logo = isDarkMode ? indexLogoWhite : indexLogoBlack

  if (window.innerWidth > 1400) {
    logo = isDarkMode ? indexLogoFullWhite : indexLogoFullBlack
  }

  return (
    <Image
      src={logo}
      alt='Index Coop Logo'
      minWidth='24px'
      height='40px'
      mr={['', '20px']}
    />
  )
}

export default Header
