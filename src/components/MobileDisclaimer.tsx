import { Flex, Image, Text } from '@chakra-ui/react'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoWhite from 'assets/index-logo-white.png'

const MobileDisclaimer = () => {
  const isDarkMode = true
  let logo = isDarkMode ? indexLogoWhite : indexLogoBlack

  return (
    <Flex
      direction='column'
      w='100vw'
      h='100vh'
      align='center'
      justify='center'
      padding='24px'
    >
      <Image src={logo} alt='Index Coop Logo' minWidth='24px' height='40px' />
      <Text p='24px' textAlign='center'>
        Please use the site in a web browser.
        <br />
        Currently we don't support mobile.
      </Text>
    </Flex>
  )
}

export default MobileDisclaimer
