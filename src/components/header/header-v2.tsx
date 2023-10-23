import { Flex, HStack, Link, Spacer } from '@chakra-ui/react'

import { Connect } from './connect'
import { Logo } from './logo'
import { colors } from '@/lib/styles/colors'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'

const links = [
  { href: '/swap', label: 'Swap' },
  { href: '/vaults', label: 'Vaults' },
]

const HeaderV2 = () => {
  const pathname = usePathname()
  return (
    <Flex
      as='header'
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
        <HStack spacing={['16px', '24px']} marginRight={['', '', '', '20px']}>
          <Link
            href='https://indexcoop.com/'
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Logo />
          </Link>
          {links.map((link) => (
            <Link
              as={NextLink}
              key={link.href}
              color={pathname === link.href ? colors.icGray4 : colors.icGray3}
              fontWeight={600}
              href={link.href}
              _hover={{
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </HStack>
        <Spacer />
        <Flex align='center' justifyContent={'flex-end'}>
          <Connect />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HeaderV2
