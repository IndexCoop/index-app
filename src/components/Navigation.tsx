import { Box, Flex, Link, Text } from '@chakra-ui/layout'

const NavLink = (props: { href: string; linkText: string }) => {
  return (
    <Box pr='48px'>
      <Link
        display='block'
        position='relative'
        href={props.href}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-4px',
          left: '0',
          width: ' 100%',
          height: '0.1em',
          backgroundColor: '#fff',
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
        <Text color='#fff' fontSize='xl' fontWeight='700'>
          {props.linkText}
        </Text>
      </Link>
    </Box>
  )
}

const Navigation = () => {
  return (
    <Flex>
      <NavLink href='/' linkText='My Dashboard' />
      <NavLink href='/products' linkText='Products' />
      <NavLink href='/lm' linkText='Liquidity Mining' />
    </Flex>
  )
}

export default Navigation
