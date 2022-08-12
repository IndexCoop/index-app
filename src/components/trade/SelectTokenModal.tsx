import { BigNumber } from 'ethers'
import { colors, useICColorMode } from 'styles/colors'

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

export const SelectTokenModal = (props: SelectTokenModalProps) => {
  const { isDarkMode } = useICColorMode()
  const { isOpen, onClose, onSelectedToken, items } = props
  const backgroundColor = isDarkMode ? colors.background : colors.white
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
          {items.length > 0 &&
            items.map((item) => (
              <TokenItem
                key={item.symbol}
                isDarkMode={isDarkMode}
                item={item}
                onClick={() => onSelectedToken(item.symbol)}
              />
            ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type TokenItemProps = {
  isDarkMode: boolean
  item: SelectTokenModalItem
  onClick: (tokenSymbol: string) => void
}

const TokenItem = ({ isDarkMode, item, onClick }: TokenItemProps) => (
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

export function getSelectTokenListItems(
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
