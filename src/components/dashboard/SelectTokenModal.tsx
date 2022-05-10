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
import { BigNumber } from 'ethers'

import { Token } from 'constants/tokens'
import { displayFromWei } from 'utils'

type SelectTokenModalItem = {
  symbol: string
  logo: string
  tokenName: string
  balance: string
}

type SelectTokenModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectedToken: (tokenSymbol: string) => void
  items: SelectTokenModalItem[]
}

export const SelectTokenModal = ({
  isOpen,
  onClose,
  onSelectedToken,
  items,
}: SelectTokenModalProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay
        bg='rgba(0, 0, 0, 0.6)'
        backdropFilter='auto'
        backdropBlur='8px'
      />
      <ModalContent borderRadius='25px' h={['60vh', '50vh']} m={['16px', 0]}>
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody p='16px'>
          {items.length > 0 &&
            items.map((item) => (
              <TokenItem
                key={item.symbol}
                item={item}
                onClick={() => onSelectedToken(item.symbol)}
              />
            ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const TokenItem = ({
  item,
  onClick,
}: {
  item: SelectTokenModalItem
  onClick: (tokenSymbol: string) => void
}) => (
  <Flex
    align='center'
    justify='space-between'
    cursor='pointer'
    h='60px'
    m='4px'
    onClick={() => onClick(item.symbol)}
  >
    <Flex align='center'>
      <Image alt={`${item.symbol} logo`} src={item.logo} w='40px' h='40px' />
      <Flex direction='column' ml='16px'>
        <Text fontSize='md' fontWeight='500'>
          {item.symbol}
        </Text>
        <Text fontSize='sm' fontWeight='500'>
          {item.tokenName}
        </Text>
      </Flex>
    </Flex>
    <Flex align='flex-end' direction='column' ml='16px'>
      <Text fontSize='md' fontWeight='700'>
        {item.balance}
      </Text>
      <Text fontSize='sm' fontWeight='500'></Text>
    </Flex>
  </Flex>
)

export function getSelectTokenList(
  tokens: Token[],
  balances: BigNumber[]
): SelectTokenModalItem[] {
  const tokenList: SelectTokenModalItem[] = tokens.map((token, index) => ({
    symbol: token.symbol,
    logo: token.image,
    tokenName: token.name,
    balance: displayFromWei(balances[index], 3, token.decimals) ?? '0',
  }))
  return tokenList
}
