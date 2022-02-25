import { colors } from 'styles/colors'

import { Box, Flex, Link, Text, useColorMode } from '@chakra-ui/react'

import ColorThemeIcon from 'components/header/ColorThemeIcon'

const NavLink = (props: {
  href: string
  linkText: string
  textColor: string
}) => {
  return (
    <Box pr='2.5vw'>
      <Link
        display='block'
        position='relative'
        href={props.href}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: ' 100%',
          height: '0.1em',
          backgroundColor: colors.white,
          opacity: 0,
          transition: 'opacity 300ms, transform 300ms',
        }}
        _focus={{
          _after: {
            opacity: 1,
            transform: 'translate3d(0, 0.2em, 0)',
          },
        }}
        _hover={{
          _after: {
            opacity: 1,
            transform: 'translate3d(0, 0.2em, 0)',
          },
        }}
      >
        <Text color={props.textColor} fontSize='xl' fontWeight='700'>
          {props.linkText}
        </Text>
      </Link>
    </Box>
  )
}

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const textColor = colorMode === 'light' ? 'black' : 'white'

  return (
    <Flex>
      <NavLink href='/' linkText='My Dashboard' textColor='textColor' />
      <NavLink href='/products' linkText='Products' textColor='textColor' />
      <NavLink
        href='/liquidity-mining'
        linkText='Liquidity Mining'
        textColor='textColor'
      />
      <Box height='32px' onClick={toggleColorMode}>
        <ColorThemeIcon color={textColor} />
      </Box>
    </Flex>
  )
}

export default Navigation
