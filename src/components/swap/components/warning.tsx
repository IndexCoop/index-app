import { Flex } from '@chakra-ui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

import { addMEVProtectionChain } from '@/lib/utils/chains'

export enum WarningType {
  flashbots,
  priceImpact,
  restricted,
  vpn,
}

export interface Warning {
  title: string
  node: ReactNode
}

const warningsData: Record<
  WarningType.priceImpact | WarningType.restricted | WarningType.vpn,
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
        <a
          href='https://indexcoop.com/terms-of-service'
          className='underline'
          target='_blank'
        >
          Terms of Service
        </a>
        . Please also see our{' '}
        <a
          href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
          className='underline'
          target='_blank'
        >
          Tokens Restricted for Restricted Persons
        </a>{' '}
        page.
      </>
    ),
  },
  [WarningType.vpn]: {
    title: 'Not Available to VPN Users',
    node: (
      <>
        It appears you may be using a VPN and, because some of our tokens are
        not available to Restricted Persons - including US persons - as defined
        in our{' '}
        <a
          href='https://indexcoop.com/terms-of-service'
          className='underline'
          target='_blank'
        >
          Terms of Service
        </a>
        , we are required to restrict access to VPN users. Please also see our{' '}
        <a
          href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
          className='underline'
          target='_blank'
        >
          Tokens Restricted for Restricted Persons
        </a>{' '}
        page.
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
        <p className='text-ic-gray-600 ml-2 text-sm font-semibold'>
          MEV Protection
        </p>
      </Flex>
      <p className='text-ic-gray-600 mt-2 text-xs font-normal leading-[18px]'>
        It is highly recommended to use an MEV protected RPC.{' '}
        <span onClick={onClick} className='cursor-pointer underline'>
          Click here
        </span>{' '}
        to add the MEV Blocker network to your wallet.{' '}
        <a href='https://mevblocker.io/' target='_blank' className='underline'>
          Learn More about MEV protection
        </a>
      </p>
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
