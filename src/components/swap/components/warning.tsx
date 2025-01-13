import { Flex, Link, Text } from '@chakra-ui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

import { colors } from '@/lib/styles/colors'
import { addMEVProtectionChain } from '@/lib/utils/chains'

export enum WarningType {
  flashbots,
  priceImpact,
  restricted,
  signTerms,
}

export interface Warning {
  title: string
  node: ReactNode
}

const warningsData: Record<
  WarningType.priceImpact | WarningType.restricted | WarningType.signTerms,
  Warning
> = {
  [WarningType.priceImpact]: {
    title: 'Price Impact Warning',
    node: 'A swap of this size may have a high price impact, given the current liquidity in the pool. This means that your trade could alter the price of the token and the quantity of tokens you receive.',
  },
  [WarningType.restricted]: {
    title: 'Not Available to Restricted Persons',
    node: (
      <>
        Some of our tokens are not available to Restricted Persons - including
        US persons - as defined in our{' '}
        <Link
          href='https://indexcoop.com/terms-of-service'
          style={{ textDecoration: 'underline' }}
        >
          Terms of Service
        </Link>
        . Please also see our{' '}
        <Link
          href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
          style={{ textDecoration: 'underline' }}
        >
          Tokens Restricted for Restricted Persons
        </Link>{' '}
        page.
      </>
    ),
  },
  [WarningType.signTerms]: {
    title: 'Please sign the Terms and Conditions',
    node: (
      <>
        I confirm that I have read the{' '}
        <Link
          href='https://indexcoop.com/terms-of-service'
          style={{ textDecoration: 'underline' }}
        >
          Terms of Service
        </Link>
        , am not a restricted person - including US person - as described in the
        terms, and use the Website in compliance with the terms.
      </>
    ),
  },
}

type WarningProps = {
  warning: Warning
}

export const WarningComp = (props: WarningProps) => (
  <div className='mx-4 mb-2 mt-5 flex items-start gap-3'>
    <ExclamationCircleIcon className='text-ic-gray-600 dark:text-ic-gray-400 size-5 flex-none' />
    <div className='flex flex-col gap-2'>
      <span className='text-ic-gray-600 dark:text-ic-gray-400 text-sm font-semibold'>
        {props.warning.title}
      </span>
      <p className='font-base text-ic-gray-600 dark:text-ic-gray-400 text-xs leading-[18px]'>
        {props.warning.node}
      </p>
    </div>
  </div>
)

export const WarningCompProtection = () => {
  const ethereum = window.ethereum

  const onClick = async () => {
    await addMEVProtectionChain(ethereum)
  }

  if (!ethereum) return null

  return (
    <Flex direction={'column'} m='20px 16px 8px'>
      <Flex align={'center'} direction={'row'}>
        <ExclamationCircleIcon className='text-ic-gray-600 dark:text-ic-gray-400 size-5' />
        <Text
          fontSize={'sm'}
          fontWeight={600}
          ml={2}
          textColor={colors.ic.gray[600]}
        >
          MEV Protection
        </Text>
      </Flex>
      <Text
        fontSize={'xs'}
        fontWeight={400}
        mt='8px'
        textColor={colors.ic.gray[600]}
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
