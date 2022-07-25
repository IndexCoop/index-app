import { colors } from 'styles/colors'

import { Flex, Image, Link, Spacer, Text } from '@chakra-ui/react'

import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

const Footer = () => {
  return (
    <Flex backgroundColor={colors.backgroundFooter} w='100vw'>
      <Flex
        align='center'
        p={[
          '32px 16px 32px 24px',
          null,
          '32px 60px 32px 60px',
          '32px 80px 32px 80px',
        ]}
        w='100%'
      >
        <Logo />
        <Flex direction={['column', 'column', 'column', 'row']}>
          <Link href='/liquidity-mining'>
            <Text color={colors.icGray2} mr='8'>
              Liquidity Mining (discontinued)
            </Text>
          </Link>
          <Link href='https://indexcoop.com/legal/privacy-policy'>
            <Text color={colors.icWhite} mr='8'>
              Privacy Policy
            </Text>
          </Link>
          <Link href='https://indexcoop.com/legal/terms-of-service'>
            <Text color={colors.icWhite} mr='8'>
              Terms of Service
            </Text>
          </Link>
          <Link href='https://indexcoop.com/legal/tokens-restricted-for-us-persons'>
            <Text color={colors.icWhite} mr='8'>
              Tokens Restricted for US Persons
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

const Logo = () => {
  const logo = window.innerWidth > 1350 ? indexLogoFullWhite : indexLogoWhite
  return (
    <Image
      src={logo}
      alt='Index Coop Logo'
      minWidth='24px'
      height='24px'
      mr={['4', '8']}
    />
  )
}

export default Footer
