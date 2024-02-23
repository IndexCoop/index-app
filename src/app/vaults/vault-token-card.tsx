import { Button, Divider, Flex, Spacer, Text } from '@chakra-ui/react'

import { colors, useColorStyles } from '@/lib/styles/colors'

import { VaultToken } from './types'

interface Props {
  vaultToken: VaultToken
}

const formatAmount = (amount: number) =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  })

export default function VaultTokenCard({ vaultToken }: Props) {
  const { theme } = useColorStyles()
  return (
    <Flex
      p='16px'
      background={colors.white}
      border='1px'
      borderColor={colors.icGray1}
      borderRadius='23px'
      boxShadow='md'
      flexDirection='column'
    >
      <Flex mb='16px' align='center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          viewBox='0 0 28 28'
          fill='none'
        >
          <circle cx='14' cy='14' r='14' fill='#D9D9D9' />
        </svg>
        <Text fontSize='16px' fontWeight='700' lineHeight='12px' mx='9px'>
          {vaultToken.symbol}
        </Text>
        <Flex
          align='center'
          background={colors.icBlack}
          borderRadius='12px'
          marginLeft='auto'
          py='8px'
          px='8px'
        >
          <Text
            color={colors.icGray1}
            fontWeight={500}
            fontSize='10px'
            flex={1}
          >
            Annualized Target Return
          </Text>
          <Text
            color={colors.icWhite}
            fontWeight={700}
            fontSize='16px'
            flex={1}
            textAlign='end'
          >
            {vaultToken.annualizedTargetReturn}
          </Text>
        </Flex>
      </Flex>
      <Text fontSize='14px' color={colors.icGray3} fontWeight='500' mb='8px'>
        {vaultToken.description}
      </Text>
      <Text fontSize='11px' color={colors.icGray2} mb='4px'>
        {vaultToken.assets.join(', ')}
      </Text>
      <Divider color='#E0E9E9' my='15px' />
      <Flex my='6px'>
        <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
          Target Fundraise
        </Text>
        <Spacer />
        <Text color={colors.icGray4} fontSize='12px' fontWeight='700'>
          {formatAmount(vaultToken.targetFundraise.amount)}
        </Text>
        <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
          &nbsp;{vaultToken.targetFundraise.currency}
        </Text>
      </Flex>
      <Flex my='6px'>
        <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
          Minimum Commitment
        </Text>
        <Spacer />
        <Text color={colors.icGray4} fontSize='12px' fontWeight='700'>
          {formatAmount(vaultToken.minimumCommitment.amount)}
        </Text>
        <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
          &nbsp;{vaultToken.minimumCommitment.currency}
        </Text>
      </Flex>
      {vaultToken.portfolioTerm && (
        <Flex my='6px'>
          <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
            Portfolio Term
          </Text>
          <Spacer />
          <Text color={colors.icGray4} fontSize='12px' fontWeight='700'>
            {vaultToken.portfolioTerm}
          </Text>
        </Flex>
      )}
      {vaultToken.lockupPeriod && (
        <Flex my='6px'>
          <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
            Lockup Period
          </Text>
          <Spacer />
          <Text color={colors.icGray3} fontSize='12px' fontWeight='500'>
            withdrawals open every
          </Text>
          <Text color={colors.icGray4} fontSize='12px' fontWeight='700'>
            &nbsp;{vaultToken.lockupPeriod}
          </Text>
        </Flex>
      )}
      <Button
        borderRadius='10px'
        boxShadow='md'
        color={colors.icWhite}
        background={theme.colors.ic.blue[600]}
        my='8px'
      >
        Detail View
      </Button>
    </Flex>
  )
}
