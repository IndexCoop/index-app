import { Flex } from '@chakra-ui/layout'
import { Image, Text } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/system'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoFullBlack from 'assets/index-logo-full-black.png'
import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

import ConnectButton from './header/ConnectButton'
import Navigation from './Navigation'

const Header = () => {
  const { colorMode } = useColorMode()

  return (
    <Flex
      justifyContent='space-between'
      m='64px 80px 80px 80px'
      alignItems='center'
    >
      <Logo isDarkMode={colorMode === 'dark'} />
      <Navigation />
      <ConnectButton />
    </Flex>
  )
}

const Logo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  let logo = isDarkMode ? indexLogoWhite : indexLogoBlack
  const textColor = isDarkMode ? '#fff' : '#000'

  if (window.innerWidth > 450) {
    logo = isDarkMode ? indexLogoFullWhite : indexLogoFullBlack
  }

  return (
    <Flex align='flex-end'>
      <Image src={logo} alt='Index Coop Logo' minWidth='24px' height='40px' />
      <Text
        color={textColor}
        fontSize='22'
        fontWeight='700'
        mb='-5px'
        ml='12px'
      >
        App
      </Text>
    </Flex>
  )
}

export default Header
