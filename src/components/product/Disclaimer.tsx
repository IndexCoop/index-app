import { Flex, Text } from '@chakra-ui/react'

import { Token } from 'constants/tokens'

const Disclaimer = () => {
  return (
    <Flex direction='column' w={'100%'} m='0 auto' pt={'50px'}>
      <Text fontSize={'10px'}>
        You shall not purchase or otherwise acquire any of our token products if
        you are a citizen, resident (tax or otherwise), and/or green card holder
        of the United States of America, or if you are a person in any
        jurisdiction in which such offer, sale, and/or purchase of any of our
        token products is unlawful, prohibited, or unauthorized (together with
        U.S. citizens, residents, and/or green card holders, a “Restricted
        Person”). The term “Restricted Person” includes, but is not limited to,
        any natural person residing in, or any firm, company, partnership,
        trust, corporation, entity, government, state or agency of a state, or
        any other incorporated or unincorporated body or association,
        association or partnership (whether or not having separate legal
        personality) that is established and/or lawfully existing under the laws
        of, a jurisdiction in which such offer, sale, and/or purchase of any of
        our token products is unlawful, prohibited, or unauthorized). You shall
        not resell or otherwise transfer any of our token products to any
        Restricted Person, including but not limited to, citizens, residents, or
        green card holders of the United States of America or any natural person
        or entity within the United States of America. The transfer or resale of
        any of our token products to any Restricted Person is not permitted.
      </Text>
    </Flex>
  )
}

export default Disclaimer
