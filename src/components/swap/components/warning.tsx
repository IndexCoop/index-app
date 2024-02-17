import { WarningIcon } from '@chakra-ui/icons'
import { Flex, Link, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'
import { addMEVProtectionChain } from '@/lib/utils/chains'

export enum WarningType {
  flashbots,
  priceImpact,
  restricted,
}

export interface Warning {
  title: string
  text: string
}

const warningsData: Record<
  WarningType.priceImpact | WarningType.restricted,
  Warning
> = {
  [WarningType.priceImpact]: {
    title: 'Price Impact Warning',
    text: 'A swap of this size may have a high price impact, given the current liquidity in the pool. This means that your trade could alter the price of the token and the quantity of tokens you receive.',
  },
  [WarningType.restricted]: {
    title: 'Restricted Persons',
    text: 'Some of our contracts are unavailable to persons or entities who: are citizens of, reside in, located in, incorporated in, or operate a registered office in the U.S.A.',
  },
}

type WarningProps = {
  warning: Warning
}

export const WarningComp = (props: WarningProps) => (
  <Flex direction={'column'} m='20px 16px 8px'>
    <Flex align={'center'} direction={'row'}>
      <WarningIcon color={colors.icGray3} mr={'8px'} />
      <Text fontSize={'sm'} fontWeight={600} textColor={colors.icGray3}>
        {props.warning.title}
      </Text>
    </Flex>
    <Text fontSize={'xs'} fontWeight={400} mt='8px' textColor={colors.icGray3}>
      {props.warning.text}
    </Text>
  </Flex>
)

export const WarningCompProtection = () => {
  const ethereum = window.ethereum

  const onClick = async () => {
    await addMEVProtectionChain(ethereum)
  }

  if (!ethereum) return null

  return (
    <Flex
      direction={'column'}
      m='20px 16px 8px'
    >
      <Flex align={'center'} direction={'row'}>
        <WarningIcon color={colors.icGray3} mr={'8px'} />
        <Text fontSize={'sm'} fontWeight={600} textColor={colors.icGray3}>
          MEV Protection
        </Text>
      </Flex>
      <Text
        fontSize={'xs'}
        fontWeight={400}
        mt='8px'
        textColor={colors.icGray3}
      >
        It is highly recommended to use an MEV protected RPC.{' '}
        <Link onClick={onClick} style={{ textDecoration: 'underline' }}>
        Click here
        </Link>{' '}
        to add the MEV Blocker network to your wallet.{' '}
        <Link
          href='https://mevblocker.io/'
          isExternal
          style={{ textDecoration: 'underline' }}
        >
          Learn More about MEV protection
        </Link>
      </Text>
    </Flex>
  )
}

type WarningsProps = {
  warnings: WarningType[]
}

export const Warnings = (props: WarningsProps) => {
  return (
    <>
      {props.warnings.map((warningType) => {
        if (warningType === WarningType.flashbots) {
          return <WarningCompProtection key={warningType.toString()} />
        }
        const warning = warningsData[warningType]
        return (
          <WarningComp key={warning.title.toLowerCase()} warning={warning} />
        )
      })}
    </>
  )
}
