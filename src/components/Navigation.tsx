import { useState } from 'react'

import { colors } from 'styles/colors'

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  IconButton,
  Link,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'

import ColorThemeIcon from 'components/header/ColorThemeIcon'

import ConnectButton from './header/ConnectButton'

const NavLink = (props: {
  href: string
  linkText: string
  textColor: string
}) => {
  return (
    <Box mr={['0', '0', '0', '24px']} mt={['30px', '30px', '30px', '0']}>
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

const NavContent = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const textColor = colorMode === 'light' ? 'black' : 'white'
  return (
    <Flex
      flexDirection={['column', 'column', 'column', 'row']}
      alignItems={'center'}
    >
      <NavLink href='/' linkText='My Dashboard' textColor='textColor' />
      <NavLink href='/products' linkText='Products' textColor='textColor' />
      <NavLink
        href='/liquidity-mining'
        linkText='Liquidity Mining'
        textColor='textColor'
      />
      <IconButton
        aria-label='Color Theme Switch'
        onClick={toggleColorMode}
        border='0'
        background={'transparent'}
        mt={['30px', '30px', '30px', '0']}
        mr={['0', '0', '0', '24px']}
        icon={<ColorThemeIcon color={textColor} />}
        size='sm'
      />
    </Flex>
  )
}

const Navigation = () => {
  const [displayMenu, setDisplayMenu] = useState('none')
  const bgColor = useColorModeValue(colors.icWhite, colors.background)
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: true,
  })
  const width = isWeb ? 1024 : 340
  console.log('isWeb', isWeb)

  return (
    <Flex w={['auto', 'auto', 'auto', width]} flexGrow={['0', '0', '0', '2']}>
      {/* Desktop Menu */}
      <Flex
        display={['none', 'none', 'none', 'flex']}
        flexDirection={'row'}
        w='100%'
        justifyContent={'space-between'}
      >
        <NavContent />

        <ConnectButton />
      </Flex>

      {/* Mobile Menu */}
      <Flex display={['flex', 'flex', 'flex', 'none']} flexDirection={'column'}>
        <IconButton
          aria-label='Open Menu'
          icon={<HamburgerIcon />}
          display={['flex', 'flex', 'flex', 'none']}
          onClick={() => setDisplayMenu('flex')}
        />
        <Flex
          flexDir={'column'}
          align={'center'}
          w='100vw'
          h='100vh'
          position='fixed'
          top='0'
          left='0'
          overflowY={'auto'}
          bgColor={bgColor}
          zIndex={30}
          display={displayMenu}
          p={[
            '16px 8px 8px 24px',
            '16px 8px 8px 24px',
            '42px 60px 60px 60px',
            '64px 80px 80px 80px',
          ]}
        >
          <IconButton
            aria-label='Close Menu'
            alignSelf={'flex-end'}
            size={'md'}
            icon={<CloseIcon />}
            onClick={() => setDisplayMenu('none')}
            display={['flex', 'flex', 'flex', 'none']}
          />
          <ConnectButton />
          <NavContent />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Navigation
