import { Flex, Link, Text } from '@chakra-ui/layout'

const NavLink = (props: { href: string; linkText: string }) => {
  return (
    <Link paddingRight='20px' href={props.href}>
      <Text fontSize='xl'>{props.linkText}</Text>
    </Link>
  )
}

const Navigation = () => {
  return (
    <Flex
      width='100vw'
      padding='20px 40px'
      borderBottom='1px'
      borderTop='1px'
      borderColor='gray.200'
      marginBottom='20px'
    >
      <NavLink href='/' linkText='Dashboard' />
      <NavLink href='/dpi' linkText='Products' />
      <NavLink href='/lm' linkText='Liquidity Mining' />
    </Flex>
  )
}

export default Navigation
