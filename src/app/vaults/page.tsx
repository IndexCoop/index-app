'use client'

import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'
import { VaultToken } from './types'
import VaultTokenCard from './vault-token-card'

const vaultTokens: VaultToken[] = [
  {
    symbol: 'icTBILL',
    description:
      'Deposit your USDC to secure $icTBILL ownership reflecting off-chain T-Bill assets. You will receive a non-transferrable token.',
    annualizedTargetReturn: '7-10%',
    assets: ['Maple', 'Open Eden TBILL', 'Ondo', 'IBG1', 'Flux'],
    targetFundraise: {
      amount: 10000000,
      currency: 'USDC',
    },
    minimumCommitment: {
      amount: 1000000,
      currency: 'USDC',
    },
    portfolioTerm: '30 days',
  },
  {
    symbol: 'icREAL',
    description:
      'Deposit your USDC to secure $icREAL ownership, reflecting off-chain real world assets. You will receive a non-transferrable token.',
    annualizedTargetReturn: '8-11%',
    assets: ['IC R'],
    targetFundraise: {
      amount: 10000000,
      currency: 'USDC',
    },
    minimumCommitment: {
      amount: 1000000,
      currency: 'USDC',
    },
    lockupPeriod: '6 months',
  },
]

export default function VaultsPage() {
  return (
    <Flex flexDirection='column' mx={['8px', null, null, '16px']}>
      <Text color={colors.icGray4} fontSize='20px' fontWeight='600' mb='16px'>
        Vaults
      </Text>
      <Text
        color={colors.icGray3}
        fontWeight='500'
        fontSize='14px'
        lineHeight='24px'
        mb='44px'
      >
        The icREAL Vault is where you can deposit your USDC to secure $icREAL
        ownership. You will receive a non-transferrable token with which you can
        claim your USDC back when needed. Please be aware that due to the
        mechanics of the token withdrawals are queued and can take up to 1 week
        to process in the case of extremely high demand.
      </Text>
      <Flex
        flexDirection={['column', null, 'row']}
        gap={['16px', null, null, '24px']}
      >
        {vaultTokens.map((vaultToken) => (
          <VaultTokenCard key={vaultToken.symbol} vaultToken={vaultToken} />
        ))}
      </Flex>
    </Flex>
  )
}
