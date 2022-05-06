import { colors } from 'styles/colors'

import {
  Box,
  Flex,
  IconButton,
  Link,
  Text,
  useColorMode,
} from '@chakra-ui/react'

import ColorThemeIcon from 'components/header/ColorThemeIcon'

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
          backgroundColor: props.textColor,
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
        <Text fontSize='xl' fontWeight='900'>
          {props.linkText}
        </Text>
      </Link>
    </Box>
  )
}

const NavContent = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const textColor = colorMode === 'light' ? colors.black : colors.icWhite
  return (
    <Flex
      flexDirection={['column', 'column', 'column', 'row']}
      alignItems={'center'}
    >
      <NavLink href='/' linkText='My Dashboard' textColor={textColor} />
      <NavLink href='/products' linkText='Products' textColor={textColor} />
      <NavLink href='/index' linkText='$INDEX' textColor={textColor} />
      <NavLink
        href='/liquidity-mining'
        linkText='Liquidity Mining'
        textColor={textColor}
      />
      <IconButton
        aria-label='Color Theme Switch'
        onClick={toggleColorMode}
        border='0'
        background={'transparent'}
        mt={['30px', '30px', '30px', '0']}
        mr={['0', '0', '0', '24px']}
        icon={<ColorThemeIcon color={textColor} />}
        size='xs'
      />
    </Flex>
  )
}

export default NavContent
