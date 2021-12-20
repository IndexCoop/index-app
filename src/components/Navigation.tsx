import { useDisclosure } from '@chakra-ui/hooks'
import { Image } from '@chakra-ui/image'
import { Flex } from '@chakra-ui/layout'
import { useColorMode, useTheme } from '@chakra-ui/system'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoFullBlack from 'assets/index-logo-full-black.png'
import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

import ConnectButton from './ConnectButton'

const Header = () => {
  const { onOpen } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  let darkMode = false
  let logo

  if (window.innerWidth > 450)
    logo = colorMode === 'dark' ? indexLogoFullWhite : indexLogoFullBlack
  else logo = colorMode === 'dark' ? indexLogoWhite : indexLogoBlack

  return (
    <Flex width='100vw' padding='20px'>
      <Image src={logo} alt='Index Coop Logo' minWidth='24px' height='24px' />
      <ConnectButton handleOpenModal={onOpen} />
    </Flex>
  )
}

export default Header
