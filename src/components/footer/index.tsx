import { Flex, Link, Text } from '@chakra-ui/react'

import { colors, useColorStyles } from '@/lib/styles/colors'

const Footer = () => {
  const { styles } = useColorStyles()
  return (
    <Flex
      flexDir={'column'}
      alignItems='center'
      m={[
        '80px auto 64px',
        '96px auto 64px',
        '96px auto 64px',
        '96px auto 64px',
      ]}
      w='100vw'
    >
      <Flex
        direction='column'
        p={['32px', '32px', '32px', 0]}
        w={['100%', '100%', '100%', '1024px']}
      >
        <Flex mb={'45px'}>
          <Disclaimer />
        </Flex>
        <Links textColor={styles.text2} />
      </Flex>
    </Flex>
  )
}

const Disclaimer = () => (
  <Flex direction='column'>
    <Text fontSize={'2xs'} textColor={colors.icGray3}>
      Disclaimer: This content is for informational purposes only and is not
      legal, tax, investment, financial, or other advice. You should not take,
      or refrain from taking, any action based on any information contained
      herein, or any other information that we make available at any time,
      including blog posts, data, articles, links to third-party content,
      discord content, news feeds, tutorials, tweets, and videos. Before you
      make any financial, legal, technical, or other decisions, you should seek
      independent professional advice from a licensed and qualified individual
      in the area for which such advice would be appropriate. This information
      is not intended to be comprehensive or address all aspects of Index or its
      products. There is additional documentation on Index’s website about the
      functioning of Index Coop, and its ecosystem and community.
      <br />
      <br />
      You shall not purchase or otherwise acquire our restricted tokens if you
      are: a citizen, resident (tax or otherwise), green card holder,
      incorporated in, owned or controlled by a person or entity in, located in,
      or have a registered office or principal place of business in the U.S. (a
      “U.S. Person”), or if you are a person in any jurisdiction in which such
      offer, sale, and/or purchase of any of our token products is unlawful,
      prohibited, or unauthorized (together with U.S. Person, a “Restricted
      Person”). The term “Restricted Person” includes, but is not limited to,
      any natural person residing in, or any firm, company, partnership, trust,
      corporation, entity, government, state or agency of a state, or any other
      incorporated or unincorporated body or association, association or
      partnership (whether or not having separate legal personality) that is
      established and/or lawfully existing under the laws of, a jurisdiction in
      which such offer, sale, and/or purchase of any of our token products is
      unlawful, prohibited, or unauthorized). You shall not resell or otherwise
      transfer our restricted tokens to any Restricted Person. The transfer or
      resale of our restricted tokens to any Restricted Person is not permitted.
      Click{' '}
      <Link
        target={'_blank'}
        href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
        textDecoration={'underline'}
      >
        here
      </Link>{' '}
      to view the list of Tokens Restricted for Restricted Persons. You shall
      read the{' '}
      <Link
        target={'_blank'}
        href='https://indexcoop.com/legal/terms-of-service'
        textDecoration={'underline'}
      >
        Terms of Service
      </Link>{' '}
      and use our Website in compliance with the Terms of Service.
    </Text>
  </Flex>
)

const Links = ({ textColor }: { textColor: string }) => (
  <Flex
    direction={['column', 'column', 'column', 'row']}
    fontSize={'sm'}
    textColor={colors.icGray3}
  >
    <Flex direction={'column'} mr='4'>
      <Link
        color={textColor}
        href='https://legacyproducts.indexcoop.com/'
        isExternal
      >
        <Text color={textColor}>Legacy Products</Text>
      </Link>
      <Link
        color={textColor}
        href='https://archive.indexcoop.com/liquidity-mining'
        isExternal
      >
        <Text color={textColor}>
          Liquidity Mining
          <br />
          (discontinued)
        </Text>
      </Link>
    </Flex>
    <Flex direction={'column'} ml={[0, 0, 0, 20]} mr='4' mt={[8, 0, 0, 0]}>
      <Link
        color={textColor}
        href='https://docs.indexcoop.com/index-coop-community-handbook/protocols/security'
        isExternal
      >
        <Text color={textColor}>Audits</Text>
      </Link>
      <Link
        color={textColor}
        href='https://immunefi.com/bounty/indexcoop/'
        isExternal
      >
        <Text color={textColor}>Bug Bounty</Text>
      </Link>
      <Link
        color={textColor}
        href='https://github.com/IndexCoop/index-coop-smart-contracts'
        isExternal
      >
        <Text color={textColor}>Contracts</Text>
      </Link>
      <Link color={textColor} href='https://github.com/IndexCoop' isExternal>
        <Text color={textColor}>GitHub</Text>
      </Link>
    </Flex>
    <Flex direction={'column'} ml={[0, 0, 0, 20]} mr='4' mt={[8, 0, 0, 0]}>
      <Link
        color={textColor}
        href='https://index-coop.notion.site/Index-Coop-Brand-Resources-16bfd8ba832046948bf747b4dc88f899'
        isExternal
      >
        <Text color={textColor}>Press Kit</Text>
      </Link>
      <Link color={textColor} href='https://indexcoop.com/legal/privacy-policy'>
        <Text color={textColor}>Privacy Policy</Text>
      </Link>
      <Link
        color={textColor}
        href='https://indexcoop.com/legal/terms-of-service'
      >
        <Text color={textColor}>Terms of Service</Text>
      </Link>
      <Link
        color={textColor}
        href='https://indexcoop.com/legal/tokens-restricted-for-us-persons'
      >
        <Text color={textColor}>Tokens Restricted for US Persons</Text>
      </Link>
    </Flex>
  </Flex>
)

export default Footer
