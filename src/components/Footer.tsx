import { useICColorMode } from 'styles/colors'

import { Flex, Image, Link } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/system'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoFullBlack from 'assets/index-logo-full-black.png'
import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

const Footer = () => {
  const { isDarkMode } = useICColorMode()
  const backgroundColor = isDarkMode
    ? 'rgba(0, 0, 0, 0.6)'
    : 'rgba(255, 255, 255, 0.82)'

  return (
    <Flex
    // backgroundColor={backgroundColor}
    // p={[
    //   '16px 16px 16px 24px',
    //   null,
    //   '32px 60px 32px 60px',
    //   '32px 80px 32px 80px',
    // ]}
    // position='fixed'
    // top='0px'
    // w='100vw'
    >
      <Flex align='center' justifyContent='space-between' w='100%'>
        <Logo />
      </Flex>
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
      height='30px'
      mr={['', '', '', '20px']}
    />
  )
}

export default Footer
