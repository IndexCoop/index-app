import { colors, useColorStyles } from 'styles/colors'

import { Flex, Image, Link, Text } from '@chakra-ui/react'

import indexLogoBlack from 'assets/index-logo-black.png'
import indexLogoFullBlack from 'assets/index-logo-full-black.png'
import indexLogoFullWhite from 'assets/index-logo-full-white.png'
import indexLogoWhite from 'assets/index-logo-white.png'

const Footer = () => {
  const { isDarkMode, styles } = useColorStyles()
  return (
    <Flex
      backgroundColor={styles.background}
      w='100vw'
      m={['32px 16px 32px 0', null, '32px 60px 32px 0', '32px 80px 32px 0']}
      flexDir={'column'}
      alignItems='center'
    >
      <Flex align='center' w={['390px', '500px', '820px', '1024px']} pb='32px'>
        <Logo isDarkMode={isDarkMode} />
        <Flex direction={['column', 'column', 'column', 'row']}>
          <Link color={colors.icGray2} href='/liquidity-mining'>
            <Text color={colors.icGray2} mr='8'>
              Liquidity Mining (discontinued)
            </Text>
          </Link>
          <Link href='https://indexcoop.com/legal/privacy-policy'>
            <Text color={styles.text} mr='8'>
              Privacy Policy
            </Text>
          </Link>
          <Link href='https://indexcoop.com/legal/terms-of-service'>
            <Text color={styles.text} mr='8'>
              Terms of Service
            </Text>
          </Link>
          <Link href='https://indexcoop.com/legal/tokens-restricted-for-us-persons'>
            <Text color={styles.text} mr='8'>
              Tokens Restricted for US Persons
            </Text>
          </Link>
        </Flex>
      </Flex>
      <Text
        w={['390px', '500px', '820px', '1024px']}
        pt='30px'
        fontSize={'2xs'}
      >
        Information is for educational and illustrative purposes only. The Index
        Cooperative is not engaged in the business of the offer, sale or trading
        of securities and does not provide legal, tax, or investment advice.
        Cryptocurrencies and other digital assets are speculative and involve a
        substantial degree of risk, including the risk of complete loss. There
        can be no assurance that any cryptocurrency, token, coin, or other
        crypto asset will be viable, liquid, or solvent.No Index Cooperative
        communication is intended to imply that any digital assets are low-risk
        or risk-free. The Index Cooperative works hard to provide accurate
        information on this website, but cannot guarantee all content is
        correct, complete, or updated.
      </Text>
    </Flex>
  )
}

const Logo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const fullLogo = isDarkMode ? indexLogoFullWhite : indexLogoFullBlack
  const smallLogo = isDarkMode ? indexLogoWhite : indexLogoBlack
  const logo = window.innerWidth > 1350 ? fullLogo : smallLogo
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
