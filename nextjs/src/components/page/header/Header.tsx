import { useICColorMode } from '@/lib/styles/colors'

import { Flex, Link, Spacer } from '@chakra-ui/react'

import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

import Navigation from './Navigation'

const Header = () => {
  const { isDarkMode } = useICColorMode()
  // TODO:
  const backgroundColor = isDarkMode
    ? 'rgba(15, 23, 23, 0.6)'
    : 'rgba(252, 255, 255, 0.82)'

  return (
    <Flex
      as='header'
      // backgroundColor={backgroundColor}
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

const Logo = () => {
  const { isDarkMode } = useICColorMode()
  const logo = isDarkMode ? IndexLogoWhite : IndexLogoBlack
  return <img alt='Index Coop Logo' src={logo} height='36px' width='36px' />
}

export default Header
