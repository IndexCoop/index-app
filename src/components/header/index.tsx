import Image from 'next/image'

import { useICColorMode } from '@/lib/styles/colors'

import { Flex, Link, Spacer } from '@chakra-ui/react'

import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

import Navigation from './navigation'

const Header = () => {
  // FIXME:
  const { isDarkMode } = useICColorMode()
  // TODO: w/ design changes
  const backgroundColor = isDarkMode
    ? 'rgba(15, 23, 23, 0.6)'
    : 'rgba(252, 255, 255, 0.82)'

  return (
    <Flex
      as='header'
      // backgroundColor={backgroundColor}
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

const Logo = () => {
  const { isDarkMode } = useICColorMode()
  const logo = isDarkMode ? IndexLogoWhite : IndexLogoBlack
  return <Image alt='Index Coop Logo' src={logo} height={36} width={36} />
}

export default Header
