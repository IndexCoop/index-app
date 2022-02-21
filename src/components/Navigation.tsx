import { Flex, Link, Text } from '@chakra-ui/layout'

const NavLink = (props: { href: string; linkText: string }) => {
  return (
    <Link pr='48px' href={props.href}>
      <Text fontSize='xl' fontWeight='700'>
        {props.linkText}
      </Text>
    </Link>
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
