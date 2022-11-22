import { useColorStyles, useICColorMode } from 'styles/colors'

import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react'

import { TradeButton } from '../footer/TradeButton'

import FromTo from './FromTo'
import NetworkBadge from './NetworkBadge'
import { TransactionReview } from './TransactionReview'
import TransactionReviewDetails from './TransactionReviewDetails'
import TransactionReviewSimulation from './TransactionReviewSimulation'

type SelectTokenModalItem = {
  symbol: string
  logo: string
  tokenName: string
  balance: string
  isMintable: boolean
}

type TransactionReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  tx: TransactionReview
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { isDarkMode } = useICColorMode()
  const { styles } = useColorStyles()
  const { isOpen, onClose, tx } = props
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
        borderColor={styles.border}
        borderRadius='10'
        borderStyle='solid'
        borderWidth='2px'
        m={['16px', 0]}
      >
        <ModalHeader>
          <Text>FlashMint - Review transaction</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p='16px'>
          <Flex direction='column' h='100%' w='100%'>
            <Flex mb='16px'>
              <Spacer />
              <Flex direction='column'>
                <FromTo
                  inputToken={tx.inputToken.image}
                  inputTokenAmount={tx.inputTokenAmount.toString()}
                  inputTokenSymbol={tx.inputToken.symbol}
                  outputToken={tx.outputToken.image}
                  outputTokenAmount={tx.outputTokenAmount.toString()}
                  outputTokenSymbol={tx.outputToken.symbol}
                />
                <Flex mt='16px'>
                  <NetworkBadge network={'Ethereum'} />
                </Flex>
              </Flex>
              <Spacer />
            </Flex>
            <Spacer />
            <Box m='8px'>
              <TransactionReviewSimulation />
            </Box>
            <BottomMessage />
            <TradeButton
              isDisabled={false}
              isLoading={false}
              label={'Submit Transaction'}
              onClick={() => console.log('submit')}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

/**
<Box my='8px'>
  <TransactionReviewDetails />
</Box>
*/

const BottomMessage = () => {
  const { styles } = useColorStyles()
  return (
    <Text
      align='center'
      color={styles.text3}
      fontSize='sm'
      fontWeight='500'
      mt='8px'
      mb='16px'
    >
      Submitting will open your currently connected wallet to confirm and sign
      the transaction.
    </Text>
  )
}
