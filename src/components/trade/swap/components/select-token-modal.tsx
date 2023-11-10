import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import {
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'

import { Token } from '@/constants/tokens'
import { useBalances } from '@/lib/hooks/use-balance'
import { colors, useColorStyles, useICColorMode } from '@/lib/styles/colors'
import { displayFromWei, isSameAddress } from '@/lib/utils'

type SelectTokenModalProps = {
  address?: string
  isOpen: boolean
  tokens: Token[]
  onClose: () => void
  onSelectedToken: (tokenSymbol: string) => void
}

export const SelectTokenModal = (props: SelectTokenModalProps) => {
  const { isOpen, onClose, onSelectedToken, tokens } = props
  const tokenAddresses = useMemo(
    () => tokens.map((token) => token.address!),
    [tokens]
  )
  const balances = useBalances(props.address, tokenAddresses)
  const { isDarkMode } = useICColorMode()
  const { styles } = useColorStyles()
  const backgroundColor = styles.background
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay
        bg='rgba(0, 0, 0, 0.6)'
        backdropFilter='auto'
        backdropBlur='8px'
      />
      <ModalContent
        backgroundColor={backgroundColor}
        borderColor={colors.gray}
        borderRadius='10'
        borderStyle='solid'
        borderWidth='2px'
        h={['60vh', '50vh']}
        m={['16px', 0]}
      >
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody p='16px 0'>
          <Flex justify='flex-end' pr='16px' w='100%'>
            <Text fontSize='sm' fontWeight='500'>
              Quantity Owned
            </Text>
          </Flex>
          {tokens.length > 0 &&
            tokens.map((token) => {
              const tokenBalance = balances.find((bal) =>
                isSameAddress(bal.token, token.address!)
              )
              const balance = BigNumber.from(
                tokenBalance?.value.toString() ?? '0'
              )
              const balanceDisplay =
                displayFromWei(balance, 3, token.decimals) ?? '0'
              return (
                <TokenItem
                  balance={balanceDisplay}
                  key={token.symbol}
                  extraTitle={undefined}
                  isDarkMode={isDarkMode}
                  item={token}
                  onClick={() => onSelectedToken(token.symbol)}
                />
              )
            })}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type TokenItemProps = {
  balance: string
  extraTitle?: string
  isDarkMode: boolean
  item: Token
  onClick: (tokenSymbol: string) => void
}

const TokenItem = ({
  balance,
  extraTitle,
  isDarkMode,
  item,
  onClick,
}: TokenItemProps) => (
  <Flex
    align='center'
    justify='space-between'
    cursor='pointer'
    h='60px'
    my='4px'
    px='16px'
    onClick={() => onClick(item.symbol)}
    _hover={{
      backgroundColor: isDarkMode ? colors.gray[900] : colors.gray[100],
    }}
  >
    <Flex align='center'>
      <Image alt={`${item.symbol} logo`} src={item.image} w='40px' h='40px' />
      <Flex direction='column' ml='16px'>
        <Flex align='baseline'>
          <Text fontSize='md' fontWeight='500' textColor={colors.icBlack}>
            {item.symbol}
          </Text>
          {extraTitle && (
            <Text color={colors.icBlue} fontSize='sm' fontWeight='500' ml='2'>
              {extraTitle}
            </Text>
          )}
        </Flex>
        <Text fontSize='sm' fontWeight='500' textColor={colors.icBlack}>
          {item.name}
        </Text>
      </Flex>
    </Flex>
    <Flex align='flex-end' direction='column' ml='16px'>
      <Text fontSize='md' fontWeight='700' textColor={colors.icBlack}>
        {balance}
      </Text>
      <Text fontSize='sm' fontWeight='500'></Text>
    </Flex>
  </Flex>
)
